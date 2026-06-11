---
title: "The XTEINK X4 Gets Good the Moment You Wipe It"
date: "2026-06-11"
tags:
  - "hardware"
  - "e-reader"
  - "firmware"
  - "reading"
  - "diy"
slug: "xteink-x4-gets-good"
heroImage: "blog/xteink-x4"
description: "The XTEINK X4 is a $69 credit-card-sized e-reader whose factory software does not deserve the hardware. Here is the ten-minute fix and what we learned living with it for a few weeks."
draft: false
---

The XTEINK X4 is a $69 e-reader the size of a credit card, and the factory software does not deserve the hardware. The stock OS chokes on complex formatting, strips images out of everything, and treats a capable little ESP32-C3 device like a toy. The community noticed. The fix takes about ten minutes and a web browser.

Here is what actually works, after a few weeks of flashing, breaking, and reading on this thing.

## Pick your firmware: CrossPoint or CrossInk

There are two real options, and the choice is simpler than the forum debates make it sound.

CrossPoint is the foundation. It is open-source, built specifically for the X4's low-power chip, and the reason this device has a community at all. It is stable, the menus are fast, the layout is minimal, and the battery lasts for weeks. If we want a reader that just reads, we flash CrossPoint and stop thinking about it.

CrossInk is the community fork for people who want more and will tolerate some rough edges to get it. As of version 1.2.10 it renders images natively, which the stock conversion pipeline used to strip out entirely. That means manga, biographies with photo inserts, and textbooks are suddenly viable on a 4.3-inch screen. It also adds proper EPUB 2/3 support with inline CSS, sleep screens that can show our book cover or even the page we are on, a sunlight mode that compensates for the screen's UV-fading quirk, and bionic reading with guide dots if our eyes need help staying on track at this size.

Our take: CrossPoint for a daily driver, CrossInk if image support matters. We can switch later. It is the same flashing process either way.

## Flashing it

No terminal, no scripts. The whole thing runs through a browser.

A few things to handle before we start. Units from AliExpress and other third-party sellers sometimes ship with the flashing interface locked, while units from the official XTEINK store do not. If ours ships locked, we run the unlock utility on the CrossPoint site first, because skipping this step is how we brick the device. We also need a real data cable, since the X4 does not include one and plenty of cheap USB-C cables only carry power. The flashing tool relies on Web Serial, so we use Chrome, Edge, or Opera; Safari and Firefox will not work. And the screen has to stay awake during the process, because a sleeping X4 will not show up in the serial picker.

Then we go in order. First, open the CrossPoint Web Installer and plug in the device. If it does not appear, or we are working with an AliExpress unit, run the unlock tool first. Second, back up the stock firmware. Click "Save full flash" and wait the two to five minutes it takes to download `flash.bin`. This file is our only road back to factory stock, and we do not skip it. Third, flash. For CrossPoint, pick the latest release from the installer's menu. For CrossInk, grab `firmware.bin` from the GitHub releases page, upload it via "Custom .bin," and flash. When it finishes, unplug, press the small reset button on the bottom-right edge, then immediately hold the power button.

That is it. The device that boots up is not the device we bought.

One more software trick: custom fonts do not require reflashing. The CrossPoint Font Builder converts standard desktop fonts (Bookerly, Bitter, whatever we like) into `.cpfont` files. We drop them in a `/fonts/` folder on the microSD card and switch from the Reader Options menu. One caveat: the chip has about 380KB of usable RAM, so loading many fonts over Wi-Fi at once can choke it. If things get sluggish, hit reset. Once the fonts cache to the card, it runs fine.

## Getting books on it: the Calibre workflow

Here is the part most guides skip. The X4 does not show up as a USB drive when we plug it in. There is no mass storage mode. So we have three real options for loading books, and which one we pick changes how we use the device.

The first is the card swap. We pop the microSD out, stick it in an adapter, and drag EPUBs over. Simple, fast, works offline. Two things will bite us if we do not know them. Format the card as FAT32, not exFAT, because on exFAT, fragmented files can silently stop reading partway through a book, which is a maddening bug to diagnose. And do not dump an entire 500-book library onto the card. CrossPoint shows files as a flat list with no search, so a full library is just scrolling punishment. We treat the X4 like a nightstand, not a bookshelf: five to ten books we actually intend to read.

The second is Calibre Wireless, and this is the one we would set up. CrossPoint has an official Calibre device plugin. Install it from the project's GitHub releases, put the X4 in File Transfer mode and select Calibre Wireless, make sure both devices are on the same network, and "Send to device" works exactly like it does with a Kobo or Kindle. No card swapping, no adapter hunting.

The third is the SD-card device plugin, for the committed. A community plugin teaches Calibre to recognize a CrossPoint-formatted card as a reading device the moment we mount it. The clever part is that it reads the X4's progress files and syncs our current chapter and page back into Calibre columns. Our library manager knows where we are in every book. That is a feature some $300 readers do not have.

One more tool worth knowing: if an EPUB renders badly, CrossPoint has a built-in EPUB Optimizer that reprocesses the file on-device. We run it before assuming the book itself has problems.

## Sleep screens: the free upgrade everyone forgets

E-ink holds an image with the power off. That means the sleep screen is not a lock screen, it is a small framed print that happens to be a book. Stock firmware wastes this. The custom firmware does not.

CrossPoint ships with four modes: the default dark logo, a light version, our current book's cover (still experimental, fair warning), and Custom. Custom is the one we want. Make a folder called `sleep` in the root of the microSD card, drop in BMP files at 480 by 800 to match the screen, and the device picks one at random every time it sleeps. Fill the folder and the X4 greets us with something different every time we set it down. We can also set any BMP as the sleep cover directly from the image viewer while browsing files, no card swap needed.

Where do the images come from? The community has built collections of thousands of pre-sized X4 wallpapers. There is a project that generates ranked XKCD comics as 480 by 800 sleep covers. And anything we make in Canva or pull from Pinterest works once we convert it to BMP at the right resolution. High-contrast line art and engravings look spectacular on this screen. Photos with subtle gradients rarely do.

CrossInk pushes further. Its sleep modes add reading statistics and a transparent overlay of the exact page we are on, so the "off" device just shows the book, frozen mid-sentence. On iOS, the Send to X4 app even includes a sleep screen designer for building covers with text, images, and doodles, then beaming them over Wi-Fi.

It is a small thing. It is also the feature people ask about when they see the device on our desk.

## Two hardware mods, zero dollars

The X4 ships with spare MagSafe-compatible magnetic rings in the box, and most people leave them there. That is a waste, because a 5.9mm slab gets uncomfortable to hold after an hour. Both of these mods fix that with parts we may already own.

The first is the Traveler's Notebook case. Take a passport-sized Traveler's Notebook leather cover, open up one of the plastic or cardstock folder inserts, and stick a magnetic ring to it. The X4 snaps in and stays put. We get something to grip, the weight and feel of a leather-bound book, and a reader that looks like a notebook when we close it. It is the best version of this device we have found.

The second is the phone-back mount, and it is actually how XTEINK pitches the device. Almost nobody takes them up on it. The X4 is MagSafe-compatible out of the box, so it snaps straight onto the back of an iPhone or any phone with a magnetic ring. The result is a phone with two faces: feeds on one side, a book on the other. The habit change is the point. Reaching for the phone is involuntary; what we find when we flip it over does not have to be a feed. The firmware makes the mount practical too. CrossPoint's orientation control lets us rotate the reading direction to match however the device sits, and button remapping means the page-turn keys land under our thumb regardless of which way we mounted it. Our phone gains 74 grams and loses some of its grip on us.

A note on stacking these: the notebook case is the reading setup, the phone mount is the always-with-us setup. We pick based on whether we would rather carry one object or two.

## What flashing will not fix

The X4 still has no frontlight. The chassis is too thin for one, and no firmware can conjure hardware that is not there. Night reading means a clip-on light, full stop.

And if the experiment goes wrong, that `flash.bin` backup restores everything through the same web installer. The official firmware images are also available from XTEINK's flash tools site.

A $69 device where the community ships better software than the manufacturer, and the best accessory is a leather notebook from the stationery aisle. The X4 was never really a product. It is a starting point.

If you have your own X4 setup or a sleep-screen pack worth sharing, find me on [**Bluesky**](https://bsky.app/profile/joshfinnie.dev).
