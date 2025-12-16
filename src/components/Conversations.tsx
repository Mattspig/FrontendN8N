// Code for Conversations.tsx file updating the /api/state polling logic
import { useCallback, useState } from 'react';

function Conversations() {
  const [conversations, setConversations] = useState([]);

  const fetchState = useCallback(async () => {
    try {
      const response = await fetch('/api/state', {
        cache: 'no-store',
      });

      if (!response.ok) {
        console.error('Failed to fetch state:', response.statusText);
        return;
      }

      const result = await response.json();

      const data = result.events || result.data || [];

      const mappedData = data.map(item => ({
        ...item,
        senderName: item.sender_name,
        senderEmail: item.sender_email,
        recipientName: item.recipient_name,
        recipientEmail: item.recipient_email,
        threadId: item.thread_id,
      }));

      setConversations(mappedData);
    } catch (error) {
      console.error('Error fetching state:', error);
    }
  }, []);

  // Example of Conversation table navigation
  const handleNavigate = (conversation) => {
    const routeId = conversation.threadId || conversation.id;
    window.location.href = `/conversations/${routeId}`;
  };

  return (
    <div>
      <h1>Conversations</h1>
      <table>
        <thead>
          <tr>
            <th>Sender</th>
            <th>Thread</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {conversations.map((conversation) => (
            <tr key={conversation.threadId || conversation.id}>
              <td>{conversation.senderName}</td>
              <td>{conversation.threadId || 'N/A'}</td>
              <td>
                <button onClick={() => handleNavigate(conversation)}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Conversations;