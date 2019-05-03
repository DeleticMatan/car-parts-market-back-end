import {
  getToken
} from '../../utils/jwtUtils'
import {
  comparePasswords
} from '../../utils/passwordUtils'

const auth = {
  async login(parent, {
    data
  }, {
    prisma
  }, info) {
    const user = await prisma.query.user({
      where: {
        email: data.email
      }
    })

    if (!user) {
      throw new Error('Unable to login')
    }

    const isMatch = await comparePasswords(data.password, user.password)

    if (!isMatch) {
      throw new Error('Unable to login')
    }

    if (!user.active) {
      throw new Error('Unable to login')
    }

    return {
      user,
      token: getToken(user.id)
    }
  },
  async adminLogin(parent, {
    data
  }, {
    prisma
  }, info) {
    const user = await prisma.query.user({
      where: {
        email: data.email
      }
    })

    if (!user) {
      throw new Error('Unable to login')
    }

    if (user.access === 0) {
      throw new Error('Unable to login')
    }

    const isMatch = await comparePasswords(data.password, user.password)

    if (!isMatch) {
      throw new Error('Unable to login')
    }

    return {
      user,
      token: getToken(user.id)
    }
  }
}

export {
  auth as
  default
}