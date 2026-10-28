# Heartbeat 💓

A dark hospital heart-monitor whose **pulse line writes "I love you"**. Type their name, press **Start ❤**. The ECG beeps across the screen, the heart rate races from **72 to 143 BPM** (143 = I love you), the pulse line writes *I love you* in one continuous stroke and then morphs into a beating neon heart that says **My heart beats for you, <name>**.

🔗 **Live:** https://heartbeat-hackncode.sites.tab.bot/

💌 Personalise it: `https://heartbeat-hackncode.sites.tab.bot/?name=YourPerson`

## Features
- Real ECG sweep on canvas (P wave, QRS spike, T wave) with monitor-style phosphor fade
- Heart rate ramps 72 → 143 BPM, and every beat stays in sync with the trace
- The pulse line writes "I love you" as one single stroke, then morphs point by point into a heart
- Beating neon heart with a pulse line running through it and floating mini hearts
- Soft monitor beep on every beat (Web Audio, sound on 🔊)
- `?name=` personalisation (default: *For you*), Share button (Web Share API / copy link)
- Plain HTML, CSS & JavaScript, no libraries, mobile-first

## Run locally
Open `index.html` in a browser. That's it.

## Files
- `index.html`: layout (monitor, vitals, name box)
- `style.css`: hospital monitor styling, scanlines, neon
- `script.js`: ECG maths, BPM ramp, single-stroke text, heart morph, beeps, share

Day 2 of 100 Days of Code Reels. Made with ❤️ by [@hack.n.code](https://instagram.com/hack.n.code)
