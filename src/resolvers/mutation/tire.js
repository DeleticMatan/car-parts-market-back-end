import getUserId from "../../utils/getUserId"
const cloudinary = require("cloudinary").v2

cloudinary.config({
  cloud_name: "hxepbpggy",
  api_key: "927544244771539",
  api_secret: "9AlkvBGg50dCKuyiqQSy46rspcc"
})

const tire = {
  async createTire(parent, { data }, { prisma }, info) {
    let tire
    if (data.userId != null) {
      const userExists = await prisma.exists.User({
        id: data.userId
      })

      if (!userExists) {
        throw new Error("Unable to find user")
      }

      return prisma.mutation.createTire({
        data: {
          active: data.active,
          highlight: data.highlight,
          top: false,
          type: data.type,
          diameter: data.diameter,
          width: data.width,
          height: data.height,
          brand: data.brand,
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
      return prisma.mutation.createTire({
        data: {
          active: data.active,
          highlight: data.highlight,
          top: false,
          type: data.type,
          diameter: data.diameter,
          width: data.width,
          height: data.height,
          brand: data.brand,
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
  async updateTire(parent, { id, data }, { prisma, request }, info) {
    const userId = getUserId(request)

    const tireExists = await prisma.exists.Tire({
      id
    })

    if (!tireExists) {
      throw new Error("Unable to update tire")
    }

    const user = await prisma.query.user({
      where: {
        id: userId
      }
    })

    return prisma.mutation.updateTire(
      {
        where: {
          id
        },
        data
      },
      info
    )
  },
  async deleteTire(parent, { id }, { prisma, request }, info) {
    const userId = getUserId(request)

    const tireExists = await prisma.exists.Tire({
      id
    })

    if (!tireExists) {
      throw new Error("Unable to delete tire")
    }

    const user = await prisma.query.user({
      where: {
        id: userId
      }
    })

    let i = 1
    while (i < 7) {
      cloudinary.uploader.destroy(`gume/${id}-${i}`, (error, result) => {}),
        {
          invalidate: true
        }
      i++
    }

    return prisma.mutation.deleteTire(
      {
        where: {
          id
        }
      },
      info
    )
  }
}

export { tire as default }
