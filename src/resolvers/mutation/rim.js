import getUserId from "../../utils/getUserId"
const cloudinary = require("cloudinary").v2

cloudinary.config({
  cloud_name: "hxepbpggy",
  api_key: "927544244771539",
  api_secret: "9AlkvBGg50dCKuyiqQSy46rspcc"
})

const rim = {
  async createRim(parent, { data }, { prisma }, info) {
    let rim
    if (data.userId != null) {
      const userExists = await prisma.exists.User({
        id: data.userId
      })

      if (!userExists) {
        throw new Error("Unable to find user")
      }

      return prisma.mutation.createRim({
        data: {
          active: data.active,
          highlight: data.highlight,
          top: false,
          type: data.type,
          diameter: data.diameter,
          width: data.width,
          holes: data.holes,
          brand: data.brand,
          et: data.et,
          condition: data.condition,
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
      return prisma.mutation.createRim({
        data: {
          active: data.active,
          highlight: data.highlight,
          top: false,
          type: data.type,
          diameter: data.diameter,
          width: data.width,
          holes: data.holes,
          brand: data.brand,
          et: data.et,
          condition: data.condition,
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
  async updateRim(parent, { id, data }, { prisma, request }, info) {
    const userId = getUserId(request)

    const rimExists = await prisma.exists.Rim({
      id
    })

    if (!rimExists) {
      throw new Error("Unable to update rim")
    }

    const user = await prisma.query.user({
      where: {
        id: userId
      }
    })

    return prisma.mutation.updateRim(
      {
        where: {
          id
        },
        data
      },
      info
    )
  },
  async deleteRim(parent, { id }, { prisma, request }, info) {
    const userId = getUserId(request)

    const rimExists = await prisma.exists.Rim({
      id
    })

    if (!rimExists) {
      throw new Error("Unable to delete rim")
    }

    const user = await prisma.query.user({
      where: {
        id: userId
      }
    })

    let i = 1
    while (i < 7) {
      cloudinary.uploader.destroy(`felne/${id}-${i}`, (error, result) => {}),
        {
          invalidate: true
        }
      i++
    }

    return prisma.mutation.deleteRim(
      {
        where: {
          id
        }
      },
      info
    )
  }
}

export { rim as default }
