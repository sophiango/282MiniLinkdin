var aws = require('aws-sdk');
var AWS_ACCESS_KEY = "AWS_ACCESS_KEY";
var AWS_SECRET_KEY = "AWS_SECRET_KEY";
var S3_BUCKET = "mini-linkedin";
var fs = require('fs');
var s3 = require('s3');
module.exports = s3.createClient({
    maxAsyncS3: 20,     // this is the default
    s3RetryCount: 3,    // this is the default
    s3RetryDelay: 1000, // this is the default
    multipartUploadThreshold: 20971520, // this is the default (20 MB)
    multipartUploadSize: 15728640, // this is the default (15 MB)
    s3Options: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY
    }
});
