import * as teamModel from '../models/teamModel.js';

export const getTeamMembers = async (req, res) => {
  try {
    const team = await teamModel.getAllTeamMembers();
    res.status(200).json(team);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ error: 'Server error fetching team members' });
  }
};

export const getTeamMember = async (req, res) => {
  try {
    const member = await teamModel.getTeamMemberById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.status(200).json(member);
  } catch (error) {
    console.error('Error fetching team member:', error);
    res.status(500).json({ error: 'Server error fetching team member' });
  }
};

export const createTeamMember = async (req, res) => {
  try {
    const newId = await teamModel.createTeamMember(req.body);
    res.status(201).json({ message: 'Team member created successfully', id: newId });
  } catch (error) {
    console.error('Error creating team member:', error);
    res.status(500).json({ error: 'Server error creating team member' });
  }
};

export const updateTeamMember = async (req, res) => {
  try {
    const affectedRows = await teamModel.updateTeamMember(req.params.id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.status(200).json({ message: 'Team member updated successfully' });
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({ error: 'Server error updating team member' });
  }
};

export const deleteTeamMember = async (req, res) => {
  try {
    const affectedRows = await teamModel.deleteTeamMember(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.status(200).json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ error: 'Server error deleting team member' });
  }
};
