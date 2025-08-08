export interface DrillData {
  title: string;
  videoId: string;
  instructions: string[];
  tips: string[];
}

export const towelDrillData: DrillData = {
  title: "The Towel Drill (Connection Drill)",
  videoId: "vGJCGo22qbs",
  instructions: [
    "Setup: Take a standard golf towel and tuck it securely under your lead armpit (left armpit for right-handed golfer). Apply enough pressure with your upper arm against your side/chest to hold it in place",
    "Backswing: Make your backswing keeping the towel pinned. Key checkpoint is at 'left arm parallel' position where the club forms an 'L' shape - towel should still be secure",
    "Downswing Feel: As you transition to downswing, feel your trail elbow (right elbow for righty) 'squeezing into your body' to increase towel pressure and keep arms connected",
    "Execution: Perform swings maintaining towel pressure throughout. Start with shorter 'punch shot' style swings to get the feel, pause at top to check position if needed"
  ],
  tips: [
    "The towel provides instant binary feedback - it's either in place or it drops",
    "Great execution = towel stays secure from setup through follow-through",
    "OK execution = towel stays during backswing but falls during downswing/impact",
    "Poor execution = towel drops during takeaway or early backswing",
    "Focus on body turn as the primary engine, keeping arms in front of chest",
    "The swing should feel synchronized and 'in one piece'"
  ]
};

export const impactDrillData: DrillData = {
  title: "The Perfect Impact Drill (Hogan's Impact Drill)",
  videoId: "zby54CcxykQ",
  instructions: [
    "Pre-set the Perfect Impact Position: Shift weight to lead foot, open hips slightly toward target, push hands well ahead of ball creating forward shaft lean",
    "Initiate a Short Backswing: From the pre-set position, make a controlled half-swing (hands to hip or chest height)",
    "Swing Through to Impact: Return to the exact same dynamic position you pre-set at the beginning",
    "Execute the Shot: Hit the ball and hold your finish, feeling the compression and solidness"
  ],
  tips: [
    "Focus on maintaining forward shaft lean through impact",
    "Feel the weight staying on your lead foot",
    "Contact should be ball-first, taking divot in front of ball position",
    "The motion should feel fluid, powerful, and connected",
    "Great execution results in solid, crisp, compressed ball flight",
    "Poor execution often shows 'flipping' - clubhead passing hands before impact"
  ]
};

export const stayBackDrillData: DrillData = {
  title: "The Stay Back Hip Rotation Drill (Early Extension Fix)",
  videoId: "Y8AEGX-Dn_4",
  instructions: [
    "Establish Your Starting Line: At address, become aware of the line created by your backside - this is your reference point throughout the swing",
    "Rehearse the Correct Motion: Take a slow backswing, then initiate downswing feeling ONLY rotation in your hips - never forward thrust",
    "Lead Hip Movement: Feel your lead hip (left hip for righty) working up and back, away from the ball, creating space for your arms",
    "Trail Hip Rotation: Simultaneously feel your trail hip (right hip) rotating through and behind you, staying on or behind that initial starting line",
    "Execute with Feel: After rehearsing the motion, hit balls while replicating that exact sensation - it will feel exaggerated but this counters the forward-moving habit"
  ],
  tips: [
    "Replace forward thrust motion with rotational motion where hips move back and around the body",
    "Great execution = pelvis remains on or behind initial starting line through impact, spine angle maintained",
    "OK execution = forward thrust reduced but may still be slightly present, posture better maintained",
    "Poor execution = hips still move forward off starting line toward ball, feeling crowded/stuck at impact",
    "This drill eliminates common Early Extension miss-hits: blocks, pushes, and hooks",
    "Down-the-line video analysis is the best way to evaluate success with this drill"
  ]
};

export const freeTrainData: DrillData = {
  title: "Free Train Session",
  videoId: "",
  instructions: [
    "Show me your setup, swing, or any golf-related movement you want feedback on",
    "I can analyze your full swing, putting stroke, chipping technique, or practice drills",
    "Point your camera at whatever you're working on - driving range, putting green, backyard practice",
    "Say 'How does that look?' after any shot or movement for detailed analysis",
    "Ask specific questions about your technique, form, or any golf fundamentals you want to improve"
  ],
  tips: [
    "I can evaluate any aspect of your golf game - setup, swing mechanics, short game, putting",
    "Great for general practice sessions where you want real-time coaching feedback",
    "Perfect for trying new techniques or working on fundamentals",
    "I'll provide specific, actionable feedback based on what I observe in your video",
    "Feel free to ask about swing thoughts, course management, or technical adjustments",
    "This is your open practice session - work on whatever you need most improvement on"
  ]
};

export const availableDrills = {
  freeTrainDrill: freeTrainData,
  towelDrill: towelDrillData,
  impactDrill: impactDrillData,
  stayBackDrill: stayBackDrillData,
};

export type DrillKey = keyof typeof availableDrills;