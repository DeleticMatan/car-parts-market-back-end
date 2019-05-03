import {
  createWriteStream
} from 'fs'

const storeUpload = ({
  stream,
  filename
}) => {
  return new Promise((resolve, reject) =>
    stream
    .pipe(createWriteStream(filename))
    .on('finish', () => resolve(filename))
    .on('error', reject)
  )
}

export {
  storeUpload as
  default
}