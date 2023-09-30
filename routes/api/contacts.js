const express = require('express')

const Joi = require('joi')

const router = express.Router()

const {
  listContacts, 
  getContactById,
  removeContact,
  addContact,
  updateContact,
  addToFavourites
} = require('../../models/contacts')

const auth = require('../../config/authorization')

const schema = Joi.object().keys({
  name: Joi.string().alphanum().min(3).max(30),
  email: Joi.string().email(),
  phone: Joi.string().min(3).max(25)
})

// =======================GET==============================

router.get('/', auth, async (req, res, next) => {
  try {
    const contacts = await listContacts()
    res.json({ 
      status: 'success',
      code: 200,
      data: {
        contacts
      }
     })
  } catch(error) {
    console.log(error.message)
    next(error)
  }  
})

// ========================GET by ID==============================

router.get('/:contactId', auth, async (req, res, next) => {
  const { contactId } = req.params   
  try {
    const contact = await getContactById(contactId)
    if(contact) {
      res.json({ 
        status: 'success',
        code: 200,
        data: { contact }
       })
    } else {
      res.json({
        status: 'failed',
        code: 404,
        message: `Contact with ID: ${contactId} not found`
      })
    }   
  } catch(error){
      console.log(error.message);
      next(error)
  }  
})

// ====================POST=========================

router.post('/', auth, async (req, res, next) => {
  try {
    const validateBody = schema.validate(req.body)
    if(validateBody.error) {
      res.json({
        status: "error",
        code: 400,
        message: `${validateBody.error}`
      })
    } 
    const newContact = await addContact(req.body)
    if (typeof newContact !== "string") {
      res.status(201).json({
        status: "success",
        code: 201,
        data: newContact
      })
    } else {
      res.status(400).json({
        status: 'failed',
        code: 400,
        message: `Missing fields`
      })
    }
  }
  catch(error) {
    console.log(error.message)
    next(error)
  }
})

// ======================DELETE===================================

router.delete('/:contactId', auth, async (req, res, next) => {
  const { contactId } = req.params
  try {
    const contacts = await getContactById(contactId)
    if (contacts) {
      await removeContact(contactId)
      
      res.json({
        status: 'success',
        code: 204,
        message: `Contact with ID: ${contactId} deleted`
      })
    } else {
      res.status(404).json({
        status: 'failed',
        code: 404,
        message: 'Contact not found'
      })
    } 
  }
  catch(error) {
    console.log(error.message)
    next(error)
  }
  
})


// ========================PUT================================

router.put('/:contactId', auth, async (req, res, next) => {
  const { contactId } = req.params
  try {
    const validateBody = schema.validate(req.body)
    if(validateBody.error) {
      res.json({
        status: "error",
        code: 400,
        message: `${validateBody.error}`
      })
    }
    if (Object.keys(req.body)[0]) {
      await updateContact(contactId, req.body)
      const contact = await getContactById(contactId)
      if (contact) {
        res.json({ 
          status: 'success',
          code: 200,
          data: contact 
         })
      } else {
        res.status(404).json({
          status: 'failed',
          code: 400,
          message: `Contact with ID: ${contactId} not found`
        })
      }
      
    } else {
        res.status(400).json({
          status: 'failed',
          code: 400,
          message: "missing fields"
        })
    }     
  }
  catch(error) {
    console.log(error.message)
    next(error)
  } 
})

// ================PATCH===================

router.patch("/:contactId", auth, async (req, res, next) => {
  const { contactId } = req.params
  const { favourites } = req.body
  console.log(favourites)
  try {
    if (favourites === undefined) {
      return res.status(400).json({
        status: "failed",
        code: 400,
        message: "You have to set value - true or false - to add contact to your favourites"
      })
    }

    const updatedContact = await addToFavourites(contactId, favourites)

    if (updatedContact) {
      res.json({
        status: "success",
        code: 200,
        data: updatedContact,
      })
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: "Contact not found!"
      })
    }

  } catch(error) {
    console.log(error.message)
    next(error)
  }
})


module.exports = router