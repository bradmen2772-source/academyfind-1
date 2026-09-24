import { prisma } from '@/lib/prisma';

// Expo Push Notification Helper
export async function sendExpoPushNotification({
  pushToken,
  title,
  body,
  data = {},
  channelId = 'default',
  badge,
}: {
  pushToken: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  channelId?: string;
  badge?: number;
}) {
  if (!pushToken || !pushToken.startsWith('ExponentPushToken[')) {
    console.warn('⚠️ Invalid Expo push token:', pushToken);
    return false;
  }

  try {
    const message: Record<string, any> = {
      to: pushToken,
      sound: 'default',
      title,
      body,
      data,
      channelId,
      _displayInForeground: true,
    };

    // Include app icon badge count (shows number/dot on app icon like WhatsApp)
    if (typeof badge === 'number') {
      message.badge = Math.max(0, badge);
    }

    const res = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const result = await res.json();
    console.log('🚀 [EXPO PUSH SENT]', result);
    return true;
  } catch (error) {
    console.error('❌ Push Notification Error:', error);
    return false;
  }
}

/**
 * Send live push notification directly to all Admin users on their mobile app
 */
export async function notifyAdminsPush({
  title,
  body,
  data = {},
  channelId = 'default',
  badge,
}: {
  title: string;
  body: string;
  data?: Record<string, any>;
  channelId?: string;
  badge?: number;
}) {
  try {
    const adminUsers = await prisma.user.findMany({
      where: { role: 'ADMIN', pushToken: { not: null } },
      select: { pushToken: true }
    });

    // Compute unread count for admins if not provided
    const unreadCount = badge !== undefined ? badge : await prisma.adminNotification.count({
      where: { isRead: false }
    }).catch(() => undefined);

    for (const admin of adminUsers) {
      if (admin.pushToken) {
        sendExpoPushNotification({
          pushToken: admin.pushToken,
          title,
          body,
          data,
          channelId,
          badge: unreadCount,
        }).catch(err => console.error("Admin Push send error:", err));
      }
    }
  } catch (error) {
    console.error("notifyAdminsPush error:", error);
  }
}

/**
 * Send live push notification directly to a specific user/sales manager on their mobile app
 */
export async function notifyUserPush({
  userId,
  title,
  body,
  data = {},
  channelId = 'default',
  badge,
}: {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  channelId?: string;
  badge?: number;
}) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { pushToken: true }
    });

    if (user?.pushToken) {
      // Automatically compute current unread notifications count for accurate app icon badge
      const unreadCount = badge !== undefined ? badge : await prisma.userNotification.count({
        where: { userId, isRead: false }
      }).catch(() => undefined);

      await sendExpoPushNotification({
        pushToken: user.pushToken,
        title,
        body,
        data,
        channelId,
        badge: unreadCount,
      });
    }
  } catch (error) {
    console.error("notifyUserPush error:", error);
  }
}
