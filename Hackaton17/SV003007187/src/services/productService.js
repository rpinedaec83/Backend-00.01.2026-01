///esta la capa que habla directamente con la base de datos prisma si mas adelante quiero cambiar de bd no tengo que modificar los controladores

 const prisma = require('../config/db')

const getAll = async () => {
  return await prisma.product.findMany()
}

const getById = async (id) => {
  const product = await prisma.product.findUnique({ where: { id: Number(id) } })
  if (!product) throw new Error('Producto no encontrado')
  return product
}

const create = async (data) => {
  return await prisma.product.create({ data })
}


const update = async (id, data) => {
  await getById(id)
  return await prisma.product.update({
    where: { id: Number(id) },
    data
  })
}

const remove = async (id) => {
  await getById(id)
  await prisma.product.delete({ where: { id: Number(id) } })
}

module.exports = { getAll, getById, create, update, remove }

 