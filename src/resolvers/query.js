import getUserId from "../utils/getUserId"

const Query = {
  async users(parent, args, { prisma, request }, info) {
    const opArgs = {
      where: args.where,
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    }

    return prisma.query.users(opArgs, info)
  },
  me(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    return prisma.query.user(
      {
        where: {
          id: userId
        }
      },
      info
    )
  },
  ads(parent, args, { prisma }, info) {
    const opArgs = {
      where: args.where,
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    }

    return prisma.query.ads(opArgs, info)
  },
  adsConnection(parent, args, { prisma }, info) {
    const opArgs = {
      where: args.where,
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    }

    return prisma.query.adsConnection(opArgs, info)
  },
  myAds(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    const opArgs = {
      where: args.where,
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    }

    opArgs.where = {
      AND: [
        {
          user: {
            id: userId
          }
        },
        {
          active: true
        }
      ]
    }

    return prisma.query.ads(opArgs, info)
  },
  rims(parent, args, { prisma }, info) {
    const opArgs = {
      where: args.where,
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    }

    return prisma.query.rims(opArgs, info)
  },
  rimsConnection(parent, args, { prisma }, info) {
    const opArgs = {
      where: args.where,
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    }

    return prisma.query.rimsConnection(opArgs, info)
  },
  myRims(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    const opArgs = {
      where: args.where,
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    }

    opArgs.where = {
      AND: [
        {
          user: {
            id: userId
          }
        },
        {
          active: true
        }
      ]
    }

    return prisma.query.rims(opArgs, info)
  },
  tires(parent, args, { prisma }, info) {
    const opArgs = {
      where: args.where,
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    }

    return prisma.query.tires(opArgs, info)
  },
  tiresConnection(parent, args, { prisma }, info) {
    const opArgs = {
      where: args.where,
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    }

    return prisma.query.tiresConnection(opArgs, info)
  },
  myTires(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    const opArgs = {
      where: args.where,
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    }

    opArgs.where = {
      AND: [
        {
          user: {
            id: userId
          }
        },
        {
          active: true
        }
      ]
    }

    return prisma.query.tires(opArgs, info)
  }
}

export { Query as default }
