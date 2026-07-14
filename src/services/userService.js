// User Service - Generate unique codes for each user
// No personal info needed - just random unique codes

export const generateUserCode = () => {
  // Generate random 6-character code
  // Format: ABC123
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Request admin contact
export const requestAdminContact = async (userCode, message) => {
  try {
    const request = {
      userCode: userCode,
      message: message,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    // Store locally - will be picked up by admin
    return request;
  } catch (error) {
    console.error('Error requesting admin:', error);
    return null;
  }
};

// Check if user is admin (by code)
export const checkAdminStatus = async (code) => {
  // For now, hardcoded admin code
  // Later: this will check against a list of admin codes
  return code === 'ADMIN001';
};
