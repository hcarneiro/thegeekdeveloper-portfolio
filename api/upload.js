const express = require('express')
const router = express.Router()
const aws = require('aws-sdk')
const Busboy = require('busboy')
const gm = require('gm')
const async = require('async')
const _ = require('lodash')
const sizeOf = require('image-size')
const fileExtension = require('file-extension')
const config = require('../config/local-config.json')
const auth = require('../config/authentication')
const isDev = !(process.env.NODE_ENV === 'production')
let private
if (isDev) {
  private = require('../config/private.json')
}

router.use(auth)

router.post('/thumb', (req, res) => {
  let busboy = new Busboy({ headers: req.headers })
  // The file upload has completed
  busboy.on('finish', function() {
    // Your files are stored in req.files. In this case,
    // Grabs your file object from the request.
    let bucket = new aws.S3({
      params: {
        Bucket: isDev && private ? private.S3.BUCKET_NAME : process.env.S3_BUCKET_NAME,
        Region: isDev && private ? private.S3.BUCKET_REGION : process.env.S3_BUCKET_REGION
      }    
    })

    bucket.name = isDev && private ? private.S3.BUCKET_NAME : process.env.S3_BUCKET_NAME

    const imageTest = new RegExp('image\/.*')
    const file = req.files.file || req.files.image

    const params = {
      Key: file.name,
      Body: file.data,
      ContentType: file.mimetype,
      ACL: 'public-read'
    }
    const createMediaFileData = {
      name: file.name,
      contentType: file.mimetype,
      size: file.size
    }

    if (imageTest.test(file.mimetype)) {
      const dimensions = sizeOf(file.data)
      createMediaFileData.originalDimensions = _.pick(dimensions, ['width', 'height'])
    }

    async.parallel([
      function uploadOriginalFile(done) {
        bucket.upload(params, function (err, data) {
          if (err) {
           done()
          }

          createMediaFileData.url = `${isDev ? config.cdn_host : process.env.CDN_HOST}/${params.Key}`
          createMediaFileData.link = `${isDev ? config.cdn_host : process.env.CDN_HOST}/${params.Key}`
          done()
        })
      },
      function uploadThumbnail(done) {
        const extension = fileExtension(createMediaFileData.name)
        gm(params.Body, createMediaFileData.name)
          .setFormat(extension)
          .quality(90)
          .gravity('Center')
          .crop(640, 640)
          .toBuffer((err, resizedImageBuffer) => {
            if (err) {
              return done()
            }

            const resizedImageParams = {
              ACL: params.ACL,
              ContentType: params.ContentType,
              Key: `thumb-${params.Key}`,
              Body: resizedImageBuffer
            }

            if (imageTest.test(file.mimetype)) {
              const dimensions = sizeOf(resizedImageBuffer)
              createMediaFileData.resizedDimensions = _.pick(dimensions, ['width', 'height'])
            }

            bucket.upload(resizedImageParams, function (err, data) {
              if (err) {
               done()
              }

              createMediaFileData.thumbnail = `${isDev ? config.cdn_host : process.env.CDN_HOST}/${resizedImageParams.Key}`
              done()
            })
          })
      }
    ], function onEndUpload(err, results) {
      if (err) {
        return res.status(400).send(err)
      }

      res.send(createMediaFileData)
    })
  })
  req.pipe(busboy)
})

module.exports = router