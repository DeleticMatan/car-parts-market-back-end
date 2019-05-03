import getUserId from '../../utils/getUserId'
import {
  generateToken
} from '../../utils/jwtUtils'
import {
  hashPassword
} from '../../utils/passwordUtils'
import {
  sendMail,
  sendRegistrationMail,
  sendContactMail
} from '../../utils/mailer'

const user = {
  async createUser(parent, {
    data
  }, {
    prisma
  }, info) {
    const userExists = await prisma.exists.User({
      email: data.email
    })

    if (userExists) {
      throw new Error('Email is taken')
    }

    const password = await hashPassword(data.password)

    const user = await prisma.mutation.createUser({
      data: {
        ...data,
        password
      }
    })

    sendRegistrationMail(data.email, user.id)

    return {
      user,
      token: ""
    }
  },
  async updateUser(parent, {
    id,
    data
  }, {
    prisma,
    request
  }, info) {
    const userExists = await prisma.exists.User({
      id
    })
    console.log("INFO", info)
    if (!userExists) {
      throw new Error('Unable to update user')
    }

    if (typeof data.password === 'string' && data.password.length > 0) {
      data.password = await hashPassword(data.password)
    } else {
      delete data.password
    }

    return prisma.mutation.updateUser({
      where: {
        id
      },
      data
    }, info)
  },
  async deleteUser(parent, {
    id
  }, {
    prisma,
    request
  }, info) {
    const userExists = await prisma.exists.User({
      id
    })

    if (!userExists) {
      throw new Error('Unable to delete user')
    }
    return prisma.mutation.deleteUser({
      where: {
        id
      }
    }, info)
  },
  async updateMe(parent, {
    data
  }, {
    prisma,
    request
  }, info) {
    const userId = getUserId(request)

    if (typeof data.password === 'string' && data.password.length > 0) {
      data.password = await hashPassword(data.password)
    } else {
      delete data.password
    }

    return prisma.mutation.updateUser({
      where: {
        id: userId
      },
      data
    }, info)
  },
  async deleteMe(parent, args, {
    prisma,
    request
  }, info) {
    const userId = getUserId(request)

    const userExists = await prisma.exists.User({
      id: userId
    })

    if (!userExists) {
      throw new Error('Unable to delete user')
    }

    return prisma.mutation.deleteUser({
      where: {
        id: userId
      }
    }, info)
  },
  async resetPassword(parent, {
    data
  }, {
    prisma
  }, info) {
    let token = await generateToken(32)

    const user = await prisma.query.user({
      where: {
        email: data.email
      }
    })

    if (!user) {
      return false
    }

    sendMail(data.email, token)

    return await prisma.mutation.updateUser({
      where: {
        id: user.id
      },
      data: {
        passwordToken: token
      }
    }, info)
  },
  async resetComplete(parent, {
    data
  }, {
    prisma,
    request
  }, info) {
    const users = await prisma.query.users({
      where: {
        passwordToken: data.token
      }
    })

    if (!users[0]) {
      throw new Error('Unable to reset password')
    }

    const password = await hashPassword(data.password)

    return await prisma.mutation.updateUser({
      where: {
        id: users[0].id
      },
      data: {
        password
      }
    }, info)
  },
  async activateUser(parent, {
    data
  }, {
    prisma,
    request
  }, info) {
    const userExists = await prisma.exists.User({
      id: data.token
    })

    if (!userExists) {
      throw new Error('Unable to activate user')
    }

    return await prisma.mutation.updateUser({
      where: {
        id: data.token
      },
      data: {
        active: true
      }
    }, info)
  },
  contact(parent, {
    data
  }, {
    prisma
  }, info) {
    sendContactMail(data.name, data.email, data.message)
    return true
  },
}

export {
  user as
  default
}