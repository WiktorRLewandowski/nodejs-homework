const Contact = require('../service/schemas/contactsSchema')

const listContacts = async () => {
  return await Contact.find()
}

const getContactById = (id) => {
  return Contact.findOne({ _id: id })
}

const addContact = (body) => {
  const { name, email, phone } = body
  
  return Contact.create({ name, email, phone })
}

const updateContact = (contactId, body) => {
  const { name, email, phone } = body
  
  return Contact.findOneAndUpdate(
    { _id: contactId },
    { $set: { name, email, phone } },
    { new: true },
  )
}

const removeContact = contactId => {
  return Contact.findByIdAndRemove({ _id: contactId})
}

const addToFavourites = (contactId, favourites) => {
  return Contact.findByIdAndUpdate(contactId, { favourites }, { new: true })
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  addToFavourites
}