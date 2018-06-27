# ffxiv-s
Skin for ACT Overlay plugin
NOTE: If you do not have the font installed onto your computer, go to the extra folder and open up the file, "meiryo.ttc"

Most of the files that you should edit are parse.css and functions_parse.js if you want to change anything about the layout and such.

Make sure you have "ffxiv-s" and "images" folder in the same path folder.
Example:
C:/Program Files (x86)/Advanced Combat Tracker/Overlay/resources/ffxiv-s
C:/Program Files (x86)/Advanced Combat Tracker/Overlay/resources/images

The job images should be the one you got and setup ACT for the overlay. If you don't have the updated job images of SAM and RDM, just replace your entire images folder with the archive file, "jobicons.zip" in the extra folder. Open the archive file, then copy and paste all in your "images" folder.

You can also use the timer.html for your spelltimer. I changed the layout of it from the default spelltimer.html that was setup with the overlay and made it easy for me. I did not test the timer.html with any spelltimer plugin. I only used the default timer (the button that says, "Show Timer" top right of ACT) along with the custom triggers of ACT.

If you want to see what the parse.html looks like, you can check it out by opening up "preview.png" in the extra folder.

To make the spelltimer work without a special plugin, you will be using the default timer that is built in the ACT.

Step 1: Go to your "Custom Triggers"

Step 2: Add or edit any of your triggers.

  2.a: If adding, you will need to type "uses Divine Veil." in 'Regular Expression' box.

  2.b: Then type "Divine Veil" in the TTS for 'Custom trigger'.

  2.c: Type "Divine Veil" in the 'Timer or Tab name' box.
  
  2.d: Check the box "Trigger timer"
  
  If editing, just make sure you do step 2.c and 2.d.
Step 3: Once you have it added/editted, you will go to "Show Timers" in the top right of ACT.

Step 4: A box will pop-up. Right click in that box to open another window.

Step 5: You will either have some added from before if you were doing this before. If not, you will just fill in boxes with the following:

  AE/Skill/Custom Trigger Name: Divine Veil
  
  Timer period in seconds: 120
  
  Warning point in seconds: 1 (or you can put whatever)
  
  Display in Panel A: ✓ (checked)
  
  Category: Buffs
  
Step 6: Once the following have been filled from above, you can click on "Add/Edit". It should show it has been added in the box below "Search name or tooltip"

Step 7: You can close the Spell Timers box or click on "Show Timers" in ACT to close the pop-up box. It will work still even when the box isn't opened.

Step 8: Open FFXIV and feel free to test it. Since the fill in that I provided is for Paladin, you can just repeat the steps above for other jobs/classes actions/abilities.

I would use other special spelltimer plugins, but I don't want to overload my ACT with too many plugins since my computer can stop making ACT work and crash at random points.

Recoded overlay by makakiyoAnju. Original overlay by Rainbowmage.

FINAL FANTASY is a registered trademark of Square Enix Holdings Co., Ltd.

FINAL FANTASY XIV © 2010 - 2018 SQUARE ENIX CO., LTD. All Rights Reserved.
