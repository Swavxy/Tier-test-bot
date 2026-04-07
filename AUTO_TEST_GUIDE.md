# 🤖 Dragon Tier Bot - Auto-Test Guide

## ⚡ What's New: Automatic Testing

The bot now **automatically runs random tests every 5 minutes** in your testing channel!

---

## 🎯 How Auto-Test Works

### Automatic Process (Every 5 Minutes)

```
Every 5 minutes:
┌─────────────────────────────┐
│ 1. Pick random user from    │
│    channel messages         │
│                             │
│ 2. Generate random test     │
│    metrics (1-100%)         │
│                             │
│ 3. Auto-assign random tier  │
│    (HT4 to LT5)             │
│                             │
│ 4. Generate spaced test     │
│    times (30 min apart)     │
│                             │
│ 5. Post results to channel  │
│                             │
│ 6. Update player data       │
└─────────────────────────────┘
```

**No commands needed!** Bot does everything automatically.

---

## 📊 Auto-Test Example Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Tested User
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Minecraft Avatar]

Tester
@SkyWalker#1234

Region
Tier Assignment

Gamemode
PvP Testing

⚔️ Combat Skill: 76%    🎯 Accuracy: 82%
📍 Positioning: 71%      ⏱️ Timing: 85%
🔁 Consistency: 68%

Previous Tier: Unranked    New Tier: 🟠 HT3

Test Times
Jan 20, 02:45 PM

Tested By
@Tester Role

⚡ Dragon Tier Testing - Auto Generated
```

---

## 🔄 Complete Auto-Test Timeline

### When Bot Starts:
```
12:00 PM - Bot logs in
12:00 PM - Auto-test scheduler activated
12:00 PM - Message: "⚡ Auto-test scheduler started (runs every 5 minutes)"
```

### Auto-Tests Run At:
```
12:05 PM - Auto-test #1 ✅
          @Alice tested → assigned 🟡 LT1
          
12:10 PM - Auto-test #2 ✅
          @Bob tested → assigned 🟠 HT3
          
12:15 PM - Auto-test #3 ✅
          @Charlie tested → assigned 🔵 LT3
          
12:20 PM - Auto-test #4 ✅
          @Alice tested again → assigned 🔴 HT4
          Test Times now:
          - Jan 20, 12:20 PM
          - Jan 20, 12:05 PM (15 min apart)

12:25 PM - Auto-test #5 ✅
          @David tested → assigned ⚪ LT5
```

---

## 📋 Configuration

### Channel ID (Where tests post)
```javascript
// Line ~25 in dragon_tier_bot.js
const RESULTS_CHANNEL_ID = '1490920531858554940';
```
This is where auto-test results are posted.

### Test Frequency (Every 5 Minutes)
```javascript
// Line ~82 in dragon_tier_bot.js
setInterval(autoRunRandomTest, 5 * 60 * 1000);
// 5 * 60 * 1000 = 5 minutes in milliseconds

// To change to 10 minutes:
setInterval(autoRunRandomTest, 10 * 60 * 1000);

// To change to 1 minute:
setInterval(autoRunRandomTest, 1 * 60 * 1000);

// To change to 30 minutes:
setInterval(autoRunRandomTest, 30 * 60 * 1000);
```

### Tester Role ID
```javascript
// Line ~134 in dragon_tier_bot.js
const TESTER_ROLE_ID = '1489673758082990350';
```

### Test Time Spacing (30 Minutes Apart)
```javascript
// Line ~125 in dragon_tier_bot.js
const testTime = new Date(now.getTime() - (i * 30 * 60 * 1000));
// 30 * 60 * 1000 = 30 minutes
```

---

## 🚀 Getting Started

### 1. Deploy Bot to Railway
- Push code to GitHub
- Deploy to railway.app
- Set `DISCORD_BOT_TOKEN` environment variable

### 2. Bot Starts Running
```
Console logs:
✅ Dragon Tier Bot logged in as DragonTier#0000
⚡ Auto-test scheduler started (runs every 5 minutes)
```

### 3. Wait for First Auto-Test
- In 5 minutes: First automatic test runs
- Results posted to channel: `1490920531858554940`
- Then every 5 minutes after that

### 4. View Results
- Check channel for test results
- View leaderboard with `/leaderboard`
- Check player info with `/playerinfo @Player`

---

## 📱 What Happens Each Auto-Test

### Bot Action Log:
```
12:05 PM
└─ Fetching messages from channel #1490920531858554940
└─ Found 47 unique users
└─ Randomly selected: @SkyWalker
└─ Generating test metrics...
   - Combat Skill: 76%
   - Accuracy: 82%
   - Positioning: 71%
   - Timing: 85%
   - Consistency: 68%
└─ Auto-assigning tier: HT3
└─ Generating test times (30 min spacing)
└─ Posting result to channel
└─ Updating player data
└─ ✅ Complete: @SkyWalker assigned HT3
```

---

## 🎯 Automatic Features

### ✅ Auto-Selection
- Picks from channel message history
- Excludes bots automatically
- Random selection each time

### ✅ Auto-Generation
- Random test metrics (1-100% each)
- Random tier assignment (HT4 to LT5)
- Spaced-out test times (30 min apart)

### ✅ Auto-Posting
- Posts directly to channel
- Shows all metrics + tier + times
- Includes tester role mention

### ✅ Auto-Registration
- New players auto-registered
- Test counts incremented
- Times auto-generated

### ✅ Auto-Announcement
- No manual commands needed
- Posts automatically to channel
- Shows in real-time

---

## 💾 Data Tracking

Each auto-test:
1. ✅ Updates test count
2. ✅ Assigns new tier
3. ✅ Records test time
4. ✅ Generates spaced times
5. ✅ Saves to players.json

---

## 📊 Example Player After 3 Auto-Tests

```json
{
  "discordId": "123456789",
  "discordTag": "SkyWalker#1234",
  "minecraftIGN": "SkyWalker",
  "rank": "HT3",
  "testCount": 3,
  "wins": 0,
  "losses": 0,
  "dateAdded": "2024-01-20T12:00:00Z",
  "lastTested": "2024-01-20T12:10:00Z",
  "verified": true
}
```

---

## 🔧 Customize Auto-Test Behavior

### Change Frequency (5 → 10 minutes)
```javascript
// Line 82 in dragon_tier_bot.js
// Before:
setInterval(autoRunRandomTest, 5 * 60 * 1000);

// After:
setInterval(autoRunRandomTest, 10 * 60 * 1000);
```

### Change Test Time Spacing (30 → 60 minutes)
```javascript
// Line 125 in dragon_tier_bot.js
// Before:
const testTime = new Date(now.getTime() - (i * 30 * 60 * 1000));

// After:
const testTime = new Date(now.getTime() - (i * 60 * 60 * 1000));
```

### Pause Auto-Tests (Comment Out)
```javascript
// Line 82 - Comment this line to disable
// setInterval(autoRunRandomTest, 5 * 60 * 1000);
```

---

## ⚙️ Technical Details

### How It Picks Users
```
1. Fetch last 1000 messages from channel
2. Extract unique non-bot users
3. Store in Set (no duplicates)
4. Random.select() one user
5. Fetch user data from Discord
```

### How It Generates Tests
```
1. Create 5 random metrics (1-100 each)
2. Pick random tier from 7 available
3. Calculate spaced test times (30 min apart)
4. Build embed with all data
5. Post to channel
6. Save to players.json
```

### How It Updates Player Data
```
1. Load players.json
2. Add/update player entry
3. Increment testCount
4. Update rank to new tier
5. Update lastTested timestamp
6. Save back to players.json
```

---

## 🐛 Troubleshooting

### Auto-tests not running
**Problem**: Bot running but no tests every 5 minutes  
**Solution**: 
- Check bot is online in Railway logs
- Verify channel ID: `1490920531858554940`
- Check console for error messages

### Error: "Results channel is not a text channel"
**Problem**: Channel ID points to wrong type of channel  
**Solution**:
- Verify channel is a text channel (not voice, stage, etc)
- Update RESULTS_CHANNEL_ID if needed
- Restart bot

### No users found in channel
**Problem**: Channel is empty or new  
**Solution**:
- Make sure channel has messages
- Users need to have posted in the channel
- Add some test messages if needed

### Tests aren't posting
**Problem**: Bot doesn't have permissions  
**Solution**:
- Give bot "Send Messages" permission
- Give bot "Embed Links" permission
- Restart bot

---

## 📈 Monitoring Auto-Tests

### Check Console Output
```
✅ Auto-test completed for SkyWalker#1234 - Assigned: HT3
✅ Auto-test completed for PhoenixRise#5678 - Assigned: LT1
✅ Auto-test completed for Charlie#9012 - Assigned: HT4
```

### Check Leaderboard
```
/leaderboard
→ Shows newly tested players
→ Updates in real-time as tests run
```

### Check Player Info
```
/playerinfo @Player
→ Shows updated test count
→ Shows latest tier
```

---

## 🎯 Use Cases

### 24/7 Testing
- Bot runs continuously
- Tests every 5 minutes
- No manual intervention needed
- Fully automated

### Training Server
- Automatic tier assignments
- Realistic test metrics
- Shows testing history
- Tracks progress

### Leaderboard Updates
- Constant new entries
- Rankings update automatically
- Test counts increase
- History grows

---

## ⏰ Example Full Day Schedule

```
Day 1:

12:00 PM - Bot starts, scheduler activated
12:05 PM - Test 1: @User1 → HT3
12:10 PM - Test 2: @User2 → LT1
12:15 PM - Test 3: @User3 → HT4
...
(Every 5 minutes)
...
06:00 PM - Test 73: @User5 → LT2
06:05 PM - Test 74: @User1 → HT2 (retested)
...
11:55 PM - Test 143: @User10 → LT5

Total: 144 tests in 24 hours (every 5 minutes)
```

---

**Your bot now tests automatically 24/7!** 🐉⚡
