import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Basket.css';

function useAuthStatus(setIsLoggedIn: (v: boolean) => void) {
  //if the user did not log in the platform, he won't see the basket
  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };
    checkLogin();
    const handler = () => checkLogin();
    window.addEventListener('storage', handler);
    const origSetItem = localStorage.setItem;
    const origRemoveItem = localStorage.removeItem;
    localStorage.setItem = function (key, value) {
      origSetItem.call(this, key, value);
      if (key === 'token') {
        window.dispatchEvent(new Event('tokenchange'));
        setTimeout(checkLogin, 0);
      }
    };
    localStorage.removeItem = function (key) {
      origRemoveItem.call(this, key);
      if (key === 'token') {
        window.dispatchEvent(new Event('tokenchange'));
        setTimeout(checkLogin, 0);
      }
    };
    window.addEventListener('tokenchange', handler);
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('tokenchange', handler);
      localStorage.setItem = origSetItem;
      localStorage.removeItem = origRemoveItem;
    };
  }, [setIsLoggedIn]);
}

interface RideGroup {
  _id: string;
  groupName: string;
  origin: string;
  destination: string;
  time: string;
}

interface JoinedGroupData {
  _id: string;
  rideDate: string;
  groupId: RideGroup;
}

const Basket: React.FC = () => {
  const [joinedGroups, setJoinedGroups] = useState<JoinedGroupData[]>([]);
  const [open, setOpen] = useState(false);
  const [leavingGroupId, setLeavingGroupId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useAuthStatus(setIsLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      setJoinedGroups([]);
      return;
    }
    const fetchMyGroups = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const API_URL = 'http://localhost:8000/api/user/my-joined-groups';
        const response = await axios.get(API_URL, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const formattedData = response.data.data.joinedGroups.map((group: any) => ({
          ...group,
          groupId: {
            ...group.groupId,
            time: group.groupId.time || group.groupId.departureTime,
          }
        }));
        setJoinedGroups(formattedData);
      } catch {
        setJoinedGroups([]);
      }
    };
    fetchMyGroups();
  }, [isLoggedIn]);

  const handleLeave = async (groupId: string) => {
    setLeavingGroupId(groupId);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const API_URL = `http://localhost:8000/api/rideGroup/${groupId}/leave`;
      await axios.post(API_URL, {}, { headers: { 'Authorization': `Bearer ${token}` } });
      setJoinedGroups(prev => prev.filter(g => g.groupId._id !== groupId));
    } catch { }
    setLeavingGroupId(null);
  };

  if (!isLoggedIn) return null;

  return (
    <>
    {/*button to open the sidebar*/}
      <div className="basket-icon" onClick={() => setOpen(!open)}>
        <span role="img" aria-label="basket">🚐</span>
        {joinedGroups.length > 0 && <span className="basket-count">{joinedGroups.length}</span>}
      </div>
          
      {/*when he is the sidebar open*/}
      {open && (
        <div className="basket-sidebar">
          <button className="close-btn" onClick={() => setOpen(false)}>×</button>
          <h3>My Groups</h3>
          <ul>

            {/*if the user is not in ridegroups*/}
            {joinedGroups.length === 0 && (
              <li style={{ textAlign: 'center', color: '#888', fontStyle: 'italic', padding: '16px 0', fontSize: '1.1em' }}>
                You are not currently traveling in any group.
              </li>
            )}
            
            {/*if the user is in ridebookings*/}
            {joinedGroups.map((group) => (
              <li key={group._id} className="basket-group-item">
                <span>{group.groupId.groupName}</span>
                <button className="exit-btn" disabled={leavingGroupId === group.groupId._id} onClick={() => handleLeave(group.groupId._id)}>
                  {leavingGroupId === group.groupId._id ? '...' : 'Exit'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default Basket;
