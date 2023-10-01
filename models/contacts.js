const Contact = require('../service/schemas/contactsSchema')

const listContacts = async userId => {
  return await Contact.find({ owner: userId })
}

const getContactById = (id, userId) => {
  return Contact.findOne({ _id: id, owner: userId })
}

const addContact = (body, userId) => {
  const { name, email, phone } = body
  
  return Contact.create({ name, email, phone, owner: userId })
}

const updateContact = (contactId, userId, body) => {
  const { name, email, phone } = body
  
  return Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
    { $set: { name, email, phone } },
    { new: true },
  )
}

const removeContact = (contactId) => {
  return Contact.findByIdAndRemove(contactId)
}

const addToFavourites = (contactId, userId, favourites) => {
  return Contact.findOneAndUpdate(
    { _id: contactId, owner: userId }, 
    { favourites }, 
    { new: true })
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  addToFavourites
}