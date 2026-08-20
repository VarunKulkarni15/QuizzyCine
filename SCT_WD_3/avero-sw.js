self.addEventListener('push', function(event) {
  if (event.data) {
    try {
      const data = event.data.json();
      const options = {
        body: data.body || 'You have a new notification!',
        icon: data.icon || '/icon.png',
        image: data.image || undefined,
        badge: '/icon.png',
        data: {
          url: data.url || '/',
          broadcastId: data.broadcastId || null,
          averoUrl: data.averoUrl || null
        }
      };

      event.waitUntil(
        self.registration.showNotification(data.title || 'Notification', options)
      );
    } catch (e) {
      event.waitUntil(
        self.registration.showNotification('New Notification', {
          body: event.data.text()
        })
      );
    }
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  const clickData = event.notification.data;
  
  if (clickData && clickData.broadcastId && clickData.averoUrl) {
    // Ping the tracking endpoint in the background
    event.waitUntil(
      fetch(`${clickData.averoUrl}/api/track/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ broadcastId: clickData.broadcastId })
      }).catch(e => console.error('Tracking failed', e))
    );
  }

  if (clickData && clickData.url) {
    event.waitUntil(
      clients.openWindow(clickData.url)
    );
  }
});
