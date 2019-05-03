import storeUpload from "../../utils/storeUpload"
import getUserId from "../../utils/getUserId"
const cloudinary = require("cloudinary").v2

cloudinary.config({
  cloud_name: "hxepbpggy",
  api_key: "927544244771539",
  api_secret: "9AlkvBGg50dCKuyiqQSy46rspcc"
})

const ad = {
  async createAd(parent, { data }, { prisma }, info) {
    let ad
    if (data.userId != null) {
      const userExists = await prisma.exists.User({
        id: data.userId
      })

      if (!userExists) {
        throw new Error("Unable to find user")
      }

      return prisma.mutation.createAd({
        data: {
          active: data.active,
          highlight: data.highlight,
          top: false,
          adType: data.adType,
          type: data.type,
          brand: data.brand,
          model: data.model,
          label: data.label,
          category: data.category,
          subcategory: data.subcategory,
          condition: data.condition,
          year: data.year,
          yearTo: data.yearTo,
          price: data.price,
          text: data.text,
          phone: data.phone,
          phone2: data.phone2,
          name: data.name,
          email: data.email,
          city: data.city,
          expires: data.expires,
          user: {
            connect: {
              id: data.userId
            }
          }
        }
      })
    } else {
      return prisma.mutation.createAd({
        data: {
          active: data.active,
          highlight: data.highlight,
          top: false,
          adType: data.adType,
          type: data.type,
          brand: data.brand,
          model: data.model,
          label: data.label,
          category: data.category,
          subcategory: data.subcategory,
          condition: data.condition,
          year: data.year,
          yearTo: data.yearTo,
          price: data.price,
          text: data.text,
          phone: data.phone,
          phone2: data.phone2,
          name: data.name,
          email: data.email,
          city: data.city,
          expires: data.expires
        }
      })
    }
  },
  async updateAd(parent, { id, data }, { prisma, request }, info) {
    const userId = getUserId(request)

    const adExists = await prisma.exists.Ad({
      id
    })

    if (!adExists) {
      throw new Error("Unable to update ad")
    }

    const user = await prisma.query.user({
      where: {
        id: userId
      }
    })

    return prisma.mutation.updateAd(
      {
        where: {
          id
        },
        data
      },
      info
    )
  },
  async deleteAd(parent, { id }, { prisma, request }, info) {
    const userId = getUserId(request)

    const adExists = await prisma.exists.Ad({
      id
    })

    if (!adExists) {
      throw new Error("Unable to delete ad")
    }

    const user = await prisma.query.user({
      where: {
        id: userId
      }
    })

    let i = 1
    while (i < 7) {
      cloudinary.uploader.destroy(
        `autodelovi/${id}-${i}`,
        (error, result) => {}
      ),
        {
          invalidate: true
        }
      i++
    }

    return prisma.mutation.deleteAd(
      {
        where: {
          id
        }
      },
      info
    )
  },
  async uploadFile(parent, { file, id, type }, { prisma }, info) {
    const { stream, filename } = await file

    let newName = await storeUpload({
      stream,
      filename
    })

    return await cloudinary.uploader.upload(
      newName,
      {
        folder: type,
        public_id: id,
        crop: "fill",
        tags: "oglas",
        width: 510,
        height: 380
      },
      result => {
        return true
      }
    )
  },
  async deleteFile(parent, { id }, { prisma }, info) {
    return (
      await cloudinary.uploader.destroy(id, (error, result) => {
        console.log(result, error)
        return true
      }),
      {
        invalidate: true
      }
    )
  }
}

export { ad as default }
