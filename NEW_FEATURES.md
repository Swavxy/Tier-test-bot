# 🐉 Dragon Tier Bot - Updated Features Guide

## ✨ New Features

### 1. Channel-Based User Selection
- Bot picks random users from a **specific channel** instead of role
- Scans last 1000 messages to find active users
- Excludes bot accounts automatically

### 2. Random Test Results
- Generates fake test metrics when `/randomtest` is run
- Includes 5 skill categories with random percentages:
  - ⚔️ Combat Skill
  - 🎯 Accuracy
  - 📍 Positioning
  - ⏱️ Timing
  - 🔁 Consistency

### 3. Hidden IGN (Minecraft Username)
- IGN is no longer displayed in the embed
- Still shown as avatar thumbnail (for visual reference)
- Keeps player anonymity in rankings

### 4. Spaced-Out Test Times
- Test timestamps are automatically generated
- Each test is spaced **30 minutes apart**
- Going back from current time
- Shows when tests were "completed"

---

## 🎯 How It Works Now

### Step 1: Pick Random User from Channel
```
/randomtest
↓
Bot fetches messages from channel: 1487213758882250864
↓
Picks random user who posted there
↓
Generates random test results (5 metrics)
↓
Shows player with test scores
```

### Step 2: View Test Results
Shows:
- ⚔️ Combat Skill: 45%
- 🎯 Accuracy: 78%
- 📍 Positioning: 62%
- ⏱️ Timing: 81%
- 🔁 Consistency: 55%

### Step 3: Assign Tier & Show Test Times
```
/assignrank @Player
↓
Shows tier assignment
↓
Displays test times (spaced 30 min apart)
↓
Posts to announcement channel
```

---

## 📋 Embed Examples

### `/randomtest` Result

```
🎯 Random Player Selected - Test Results

Player Selected
@PlayerName#1234

Current Rank: Unranked    Tests Completed: 0

━━━━━━━━━━━━
Test Results

⚔️ Combat Skill: 72%     🎯 Accuracy: 89%
📍 Positioning: 61%       ⏱️ Timing: 84%
🔁 Consistency: 75%

━━━━━━━━━━━━

[Assign Tier] [Pick Another]
```

### `/assignrank` Result

```
✅ Tested User

Tester
@PlayerName#1234

Region
Tier Assignment

Gamemode
PvP Testing

Previous Tier: Unranked    New Tier: 🟠 HT3

Test Times
Jan 20, 11:30 AM
Jan 20, 11:00 AM
Dec 20, 10:30 AM

Tested By
@Tester Role (1489673758082990350)
```

---

## 🔧 Configuration

### Channel ID (Where to pick users from)
```javascript
// Line ~173 in dragon_tier_bot.js
const CHANNEL_ID = '1487213758882250864';
```

To change which channel users are picked from, edit this ID.

### Tester Role ID
```javascript
// Line ~265 in dragon_tier_bot.js
const TESTER_ROLE_ID = '1489673758082990350';
```

This is shown in "Tested By" field.

### Test Time Spacing
```javascript
// Line ~268 - Controls spacing between tests
const testTime = new Date(now.getTime() - (i * 30 * 60 * 1000));
// 30 * 60 * 1000 = 30 minutes in milliseconds

// To change to 1 hour: (i * 60 * 60 * 1000)
// To change to 15 min: (i * 15 * 60 * 1000)
```

---

## 📊 Test Results Generation

Each metric is random 1-100:

```javascript
combatSkill: Math.floor(Math.random() * 100) + 1,   // 1-100
accuracy: Math.floor(Math.random() * 100) + 1,       // 1-100
positioning: Math.floor(Math.random() * 100) + 1,    // 1-100
timing: Math.floor(Math.random() * 100) + 1,         // 1-100
consistency: Math.floor(Math.random() * 100) + 1     // 1-100
```

Each test run generates **different random scores**.

---

## ⏰ Test Time Examples

### First Test Assignment:
```
Previous Rank: Unranked
New Tier: 🟡 LT1
Test Times
Jan 20, 02:45 PM
```
(Shows just assigned time)

### Second Test Assignment:
```
Previous Rank: 🟡 LT1
New Tier: 🟠 HT3
Test Times
Jan 20, 03:15 PM
Jan 20, 02:45 PM
```
(30 minutes apart)

### Fifth Test Assignment:
```
Previous Rank: 🟢 LT2
New Tier: 🔵 LT3
Test Times
Jan 20, 04:45 PM
Jan 20, 04:15 PM
Jan 20, 03:45 PM
Jan 20, 03:15 PM
Jan 20, 02:45 PM
```
(Each 30 minutes apart)

---

## 🎯 Workflow Example

```
Step 1: /randomtest
→ Bot scans channel 1487213758882250864
→ Finds 50+ active users
→ Picks: @SkyWalker
→ Generates test results:
   - Combat Skill: 76%
   - Accuracy: 82%
   - Positioning: 71%
   - Timing: 85%
   - Consistency: 68%
→ Shows in embed

Step 2: /assignrank @SkyWalker
→ Picks random tier: 🟠 HT3
→ Generates test time: Jan 20, 02:45 PM
→ Shows embed:
   - Tester: @SkyWalker
   - Previous Tier: Unranked
   - New Tier: 🟠 HT3
   - Test Times: Jan 20, 02:45 PM
   - Tested By: @Tester Role

Step 3: /randomtest again
→ Picks: @PhoenixRise
→ Generates new test results
→ Shows in embed

Step 4: /assignrank @PhoenixRise
→ Picks random tier: 🟡 LT1
→ Generates test time: Jan 20, 03:15 PM
→ Shows embed with spaced times
```

---

## 🔍 What's Hidden

✅ **IGN (Minecraft Username)** - No longer shown in embed
- Avatar still visible (for reference)
- Data still stored internally

❌ **Not Hidden:**
- Discord mention
- Tier assignments
- Test times
- Test metrics

---

## 🚀 Complete Feature List

| Feature | Before | After |
|---------|--------|-------|
| User Selection | Role-based | Channel-based |
| Test Results | None | Random metrics |
| IGN Display | Visible | Hidden |
| Test Times | Single count | Spaced 30-min apart |
| Test Metrics | N/A | 5 categories |

---

## 📱 Example Test Metrics

### Sample 1:
```
⚔️ Combat Skill: 45%
🎯 Accuracy: 78%
📍 Positioning: 62%
⏱️ Timing: 81%
🔁 Consistency: 55%
Average: 64.2% (Low Tier Material)
```

### Sample 2:
```
⚔️ Combat Skill: 92%
🎯 Accuracy: 88%
📍 Positioning: 85%
⏱️ Timing: 90%
🔁 Consistency: 89%
Average: 88.8% (High Tier Material)
```

### Sample 3:
```
⚔️ Combat Skill: 50%
🎯 Accuracy: 52%
📍 Positioning: 48%
⏱️ Timing: 51%
🔁 Consistency: 49%
Average: 50% (Mid Tier Material)
```

---

## 🔄 Channel Scanning

When `/randomtest` runs:

```
1. Fetches channel by ID: 1487213758882250864
2. Scans up to 1000 messages (10 batches of 100)
3. Collects all unique non-bot users
4. Randomly picks one
5. Auto-registers in system
6. Generates test results
7. Shows in embed
```

**Note:** Older users (who haven't posted recently) won't be picked unless they have messages in the channel history.

---

## 🐛 Troubleshooting

### "No users found in channel"
**Problem**: Channel is empty or no one posted  
**Solution**: Make sure channel has messages, run in active channel

### Test results don't change
**Problem**: Expected - they're always random per `/randomtest`  
**Solution**: This is by design, each run generates new metrics

### Test times aren't spacing right
**Problem**: Check the 30-minute interval setting  
**Solution**: Verify spacing code (line ~268)

### IGN still shows
**Problem**: Using old code  
**Solution**: Make sure you have latest bot.js file

---

## 💡 Pro Tips

1. **Use Active Channel**: Pick channel with lots of messages for more users
2. **Test Variety**: Each `/randomtest` generates different results
3. **Time Spacing**: Tests show realistic 30-min gaps
4. **Randomness**: Tier assignment is always random, not based on test results
5. **Privacy**: IGN hidden but tester role shown

---

## 🎮 Quick Commands

```bash
/randomtest
→ Pick random user + show test results

/assignrank @Player
→ Assign tier + show test times spaced out

/leaderboard
→ View all rankings

/playerinfo @Player
→ View player profile (no IGN shown)
```

---

**All features ready to deploy!** 🐉⚡
