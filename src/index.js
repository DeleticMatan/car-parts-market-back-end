import "@babel/polyfill/noConflict"
import server from "./server"
import prisma from "./prisma"
const express = require("express")
const bodyParser = require("body-parser")
var http = require("http")

server.start(
  {
    port: process.env.PORT || 4000,
    cors: {
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
    }
  },
  () => {
    console.log("The server is up on port:", process.env.PORT || 4000)
  }
)

const urlParser = bodyParser.urlencoded({
  extended: false
})
const customRouter = express.Router()

customRouter.get("/highlight", urlParser, async (req, res) => {
  if (req.query.type === "REPORT") {
    if (req.query.status === "CHARGED") {
      let highlights = await prisma.query.highlights({
        where: {
          messageId: req.query.parent_msg_id
        }
      })

      if (highlights[0].adType === "a") {
        if (highlights[0].serviceID === "TOP_1311") {
          prisma.mutation.updateAd({
            where: {
              id: highlights[0].adId
            },
            data: {
              top: true
            }
          })
        }
        if (highlights[0].serviceID === "ISTAKNI_1311") {
          prisma.mutation.updateAd({
            where: {
              id: highlights[0].adId
            },
            data: {
              highlight: true
            }
          })
        }
      } else if (highlights[0].adType === "r") {
        if (highlights[0].serviceID === "TOP_1311") {
          prisma.mutation.updateRim({
            where: {
              id: highlights[0].adId
            },
            data: {
              top: true
            }
          })
        }
        if (highlights[0].serviceID === "ISTAKNI_1311") {
          prisma.mutation.updateRim({
            where: {
              id: highlights[0].adId
            },
            data: {
              highlight: true
            }
          })
        }
      } else if (highlights[0].adType === "t") {
        if (highlights[0].serviceID === "TOP_1311") {
          prisma.mutation.updateTire({
            where: {
              id: highlights[0].adId
            },
            data: {
              top: true
            }
          })
        }
        if (highlights[0].serviceID === "ISTAKNI_1311") {
          prisma.mutation.updateTire({
            where: {
              id: highlights[0].adId
            },
            data: {
              highlight: true
            }
          })
        }
      }
    }

    res.send(`OK ${req.query.msg_id}`)
    return
  } else {
    const id = req.query.text.substr(req.query.text.indexOf(" ") + 2)
    const adType = req.query.text.substr(req.query.text.indexOf(" ") + 1)[0]

    const url = `http://sr.tera-com.com/tsmsgw/s.php?username=AutoDelovi&password=a500639e84&msg_id=${
      req.query.msg_id
    }&service_id=${
      req.query.service_id
    }&type=PREMIUM_MT&shortcode=1311&msisdn=${req.query.msisdn}&mcc=${
      req.query.mcc
    }&mnc=${req.query.mnc}&text=Zahtev za naplatu poslat`

    const adNotFoundUrl = `http://sr.tera-com.com/tsmsgw/s.php?username=AutoDelovi&password=a500639e84&msg_id=${
      req.query.msg_id
    }&service_id=${req.query.service_id}&type=FREE_MT&shortcode=1311&msisdn=${
      req.query.msisdn
    }&mcc=${req.query.mcc}&mnc=${
      req.query.mnc
    }&text=Postovani, oglas nije pronadjen u sistemu, molimo vas proverite`

    if (adType === "a") {
      prisma.exists
        .Ad({
          id
        })
        .then(async response => {
          if (response === false) {
            fetch(adNotFoundUrl)
              .then(response => {
                console.log(response)
              })
              .catch(error => {
                console.log(error)
              })
          } else {
            fetch(url)
              .then(response => {
                console.log(response)
              })
              .catch(error => {
                console.log(error)
              })

            let adInfo = await prisma.mutation.createHighlight({
              data: {
                messageId: req.query.msg_id,
                serviceId: req.query.service_id,
                adId: id,
                adType
              }
            })
          }

          res.send(`OK ${req.query.msg_id}`)
        })
    } else if (adType === "r") {
      prisma.exists
        .Rim({
          id
        })
        .then(async response => {
          if (response === false) {
            fetch(adNotFoundUrl)
              .then(response => {
                console.log(response)
              })
              .catch(error => {
                console.log(error)
              })
          } else {
            fetch(url)
              .then(response => {
                console.log(response)
              })
              .catch(error => {
                console.log(error)
              })

            let rimInfo = await prisma.mutation.createHighlight({
              data: {
                messageId: req.query.msg_id,
                serviceId: req.query.service_id,
                adId: id,
                adType
              }
            })
          }

          res.send(`OK ${req.query.msg_id}`)
        })
    } else if (adType === "t") {
      prisma.exists
        .Tire({
          id
        })
        .then(async response => {
          if (response === false) {
            fetch(adNotFoundUrl)
              .then(response => {
                console.log(response)
              })
              .catch(error => {
                console.log(error)
              })
          } else {
            fetch(url)
              .then(response => {
                console.log(response)
              })
              .catch(error => {
                console.log(error)
              })

            let tireInfo = await prisma.mutation.createHighlight({
              data: {
                messageId: req.query.msg_id,
                serviceId: req.query.service_id,
                adId: id,
                adType
              }
            })
          }

          res.send(`OK ${req.query.msg_id}`)
        })
    } else {
      fetch(adNotFoundUrl)
        .then(response => {
          console.log(response)
        })
        .catch(error => {
          console.log(error)
        })

      res.send(`OK ${req.query.msg_id}`)
    }
  }
})

server.express.use(customRouter)
