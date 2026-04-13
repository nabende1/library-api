const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const getMembersCollection = () => mongodb.getdatabase().db().collection('members');

// GET /members
const getAll = async (req, res) => {
  try {
    const results = await getMembersCollection().find({}).toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
};

// GET /members/:id
const getSingle = async (req, res) => {
  try {
    const memberId = new ObjectId(req.params.id);
    const result = await getMembersCollection().findOne({ _id: memberId });

    if (!result) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    if (error.name === 'BSONError') {
      return res.status(400).json({ error: 'Invalid member ID format' });
    }
    console.error('Error fetching member:', error);
    res.status(500).json({ error: 'Failed to fetch member' });
  }
};

// POST /members
const create = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, membershipType, joinDate, address, active } =
      req.body;

    if (!firstName || !lastName || !email || !phone || !membershipType || !joinDate || !address) {
      return res.status(400).json({
        error:
          'Required fields: firstName, lastName, email, phone, membershipType, joinDate, address'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const validMembershipTypes = ['basic', 'premium', 'student', 'senior'];
    if (!validMembershipTypes.includes(membershipType.toLowerCase())) {
      return res.status(400).json({
        error: `membershipType must be one of: ${validMembershipTypes.join(', ')}`
      });
    }

    const newMember = {
      firstName,
      lastName,
      email,
      phone,
      membershipType: membershipType.toLowerCase(),
      joinDate,
      address,
      active: active !== undefined ? Boolean(active) : true
    };

    const response = await getMembersCollection().insertOne(newMember);

    res.setHeader('Content-Type', 'application/json');
    res.status(201).json({ message: 'Member created successfully', id: response.insertedId });
  } catch (error) {
    console.error('Error creating member:', error);
    res.status(500).json({ error: 'Failed to create member' });
  }
};

// PUT /members/:id
const update = async (req, res) => {
  try {
    const memberId = new ObjectId(req.params.id);
    const { firstName, lastName, email, phone, membershipType, joinDate, address, active } =
      req.body;

    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
      updateData.email = email;
    }
    if (phone !== undefined) updateData.phone = phone;
    if (membershipType !== undefined) {
      const validMembershipTypes = ['basic', 'premium', 'student', 'senior'];
      if (!validMembershipTypes.includes(membershipType.toLowerCase())) {
        return res.status(400).json({
          error: `membershipType must be one of: ${validMembershipTypes.join(', ')}`
        });
      }
      updateData.membershipType = membershipType.toLowerCase();
    }
    if (joinDate !== undefined) updateData.joinDate = joinDate;
    if (address !== undefined) updateData.address = address;
    if (active !== undefined) updateData.active = Boolean(active);

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'At least one field must be provided for update' });
    }

    const response = await getMembersCollection().updateOne(
      { _id: memberId },
      { $set: updateData }
    );

    if (response.matchedCount === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ message: 'Member updated successfully' });
  } catch (error) {
    if (error.name === 'BSONError') {
      return res.status(400).json({ error: 'Invalid member ID format' });
    }
    console.error('Error updating member:', error);
    res.status(500).json({ error: 'Failed to update member' });
  }
};

// DELETE /members/:id
const remove = async (req, res) => {
  try {
    const memberId = new ObjectId(req.params.id);

    const response = await getMembersCollection().deleteOne({ _id: memberId });

    if (response.deletedCount === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.status(200).json({ message: 'Member deleted successfully' });
  } catch (error) {
    if (error.name === 'BSONError') {
      return res.status(400).json({ error: 'Invalid member ID format' });
    }
    console.error('Error deleting member:', error);
    res.status(500).json({ error: 'Failed to delete member' });
  }
};

module.exports = { getAll, getSingle, create, update, remove };
