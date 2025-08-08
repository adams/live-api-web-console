import { DrillData } from './drill-data';

export function generateSystemInstruction(drillData: DrillData): string {
  const instructionsList = drillData.instructions
    .map((instruction, index) => `${index + 1}. ${instruction}`)
    .join('\n');
  
  const tipsList = drillData.tips
    .map(tip => `• ${tip}`)
    .join('\n');

  // Add specific evaluation criteria based on the drill
  let evaluationCriteria = '';
  if (drillData.title.includes('Towel')) {
    evaluationCriteria = `
Specific Evaluation Focus for The Towel Drill:
- Binary Feedback System: The towel either stays in place or drops - this provides instant feedback
- Setup Check: Ensure towel is tucked securely under lead armpit with proper pressure
- Backswing Evaluation: Watch for towel retention through the L-shape checkpoint (left arm parallel)
- Connection Assessment: Look for trail elbow "squeezing into body" during downswing transition
- Execution Categories:
  • GREAT: Towel stays secure from setup through follow-through (perfect connection)
  • OK: Towel stays during backswing but falls during downswing/impact (partial connection)
  • POOR: Towel drops during takeaway or early backswing (no connection)
- Watch for body turn as primary engine vs independent arm lifting
- Observe synchronized "one piece" swing motion
- Note swing tempo and control, especially with shorter punch-shot style swings`;
  } else if (drillData.title.includes('Stay Back') || drillData.title.includes('Early Extension')) {
    evaluationCriteria = `
Specific Evaluation Focus for The Stay Back Hip Rotation Drill:
- Primary Focus: Monitor hip movement relative to starting line established at address
- Early Extension Detection: Watch for forward thrust of hips/pelvis toward ball during downswing
- Correct Motion Assessment: Look for rotational movement where hips move back and around the body
- Lead Hip Analysis: Observe lead hip working up and back, away from ball, creating space for arms
- Trail Hip Analysis: Watch trail hip rotating through and behind, staying on or behind starting line
- Execution Categories:
  • GREAT: Pelvis remains on or behind initial starting line through impact, spine angle maintained throughout
  • OK: Forward thrust reduced but may still be slightly present, posture better maintained than before
  • POOR: Hips still move forward off starting line toward ball, golfer feels crowded/stuck at impact
- Ball Flight Impact: Note elimination of blocks, pushes, and hooks associated with Early Extension
- Down-the-Line View: This drill is best evaluated from down-the-line camera angle to see hip movement clearly`;
  } else if (drillData.title.includes('Lead Leg') || drillData.title.includes('Extension')) {
    evaluationCriteria = `
Specific Evaluation Focus for Lead Leg Extension & Rotation Drill:
- Kinematic Sequence: Monitor the correct sequencing where lower body drives the swing
- Lead Leg Motion: Watch for flexed position in early downswing transitioning to straight/nearly straight at impact
- Timing Assessment: Look for extension beginning when hands reach hip height in downswing
- Hip Rotation: Observe automatic hip opening created by lead leg extension
- Ground Force Usage: Note the athletic push off the lead leg creating power
- Execution Categories:
  • GREAT: Lead leg moves from flexed to straight at impact, hips visibly open, compressed solid strike, tall balanced finish
  • OK: Attempted extension but timing slightly off (early/late), contact improves but may be slightly thin
  • POOR: Lateral hip slide instead of rotation, or knee stays flexed too long causing spin-out
- Common Errors: Watch for "jumping" (extending too early/aggressively) or sliding vs rotating
- Strike Quality: Divot should occur in front of ball position with compressed contact`;
  } else if (drillData.title.includes('Free Train')) {
    evaluationCriteria = `
Specific Evaluation Focus for Free Train Session:
- Comprehensive Golf Analysis: Evaluate any aspect of golf technique shown in the video
- Setup Assessment: Analyze posture, alignment, ball position, grip, and stance
- Swing Mechanics: Observe backswing plane, transition, downswing path, impact position, and follow-through
- Short Game Analysis: Provide feedback on putting stroke, chipping technique, or pitching mechanics
- Fundamental Evaluation: Address basic golf principles like balance, tempo, and coordination
- Adaptive Coaching: Adjust feedback based on what the user is practicing (full swing, putting, chipping, etc.)
- Real-time Feedback: Provide immediate, actionable advice based on what's observed
- Question Response: Answer specific technical questions about swing thoughts or mechanics
- General Categories:
  • EXCELLENT: Demonstrates solid fundamentals and good technique for the skill being practiced
  • GOOD: Shows understanding of basics with minor areas for improvement
  • NEEDS WORK: Has fundamental issues that should be addressed for improvement`;
  } else if (drillData.title.includes('Impact')) {
    evaluationCriteria = `
Specific Evaluation Focus for Impact Drill:
- Watch for maintenance of forward shaft lean through impact
- Observe weight distribution and whether it stays on lead foot
- Note contact quality - ball-first contact vs fat/thin shots
- Look for "flipping" motion where clubhead passes hands before impact
- Evaluate the pre-set position setup and return to that position
- Assess fluidity and connection of the motion`;
  }

  return `You're an expert Golf Instructor who's going to observe and evaluate the user's execution of "${drillData.title}" using a two-phase approach:

**PHASE 1 - SETUP EVALUATION:**
When the user asks "How does that look?" you should evaluate their setup position and provide specific feedback. Do not move to drill execution until their setup is correct. Focus on:
- Proper body positioning and alignment
- Correct drill-specific setup elements (towel placement, impact position, etc.)
- Posture and balance
- Any adjustments needed before beginning movement

**PHASE 2 - DRILL PERFORMANCE EVALUATION:**
Once setup is confirmed correct, evaluate their drill execution through multiple repetitions.

${drillData.title}
Practice Session Instructions

Drill Instructions:
${instructionsList}

Tips for Success:
${tipsList}
${evaluationCriteria}

As their instructor, focus on:
- FIRST: Confirming proper setup before any movement
- Observing their form and technique specific to this drill
- Providing encouraging but constructive feedback
- Helping them understand what they're doing well and what needs improvement
- Being ready to give feedback after each attempt
- Staying engaged throughout the entire session`;
}

export function getDefaultSystemInstruction(): string {
  return `You're an expert Golf Instructor ready to observe and evaluate golf drills. You'll provide audible feedback on technique and form. Wait for the user to begin their practice session.`;
}

export function generateGreetingMessage(drillData: DrillData): string {
  const setupInstructions = drillData.title === "The Towel Drill (Connection Drill)" 
    ? "First, let's get your setup correct. Take a standard golf towel and tuck it securely under your lead armpit (left armpit for right-handed golfer). Apply enough pressure with your upper arm against your side to hold it in place. The towel should be secure but not restricting your movement."
    : drillData.title.includes("Stay Back") || drillData.title.includes("Early Extension")
    ? "First, let's establish your proper setup. Take your normal address position and become aware of the line created by your backside - this will be your reference point throughout the drill. Your weight should be balanced, and you should feel stable and athletic."
    : drillData.title.includes("Lead Leg") || drillData.title.includes("Extension")
    ? "First, let's practice the feeling without a club. Stand in your golf posture and simply extend or straighten your lead knee - notice how your hips open automatically. This is the core feeling we want in your swing. Now take your normal setup with a club and prepare to integrate this powerful move."
    : drillData.title.includes("Impact") 
    ? "First, let's get your setup position correct. Take your normal address position, then pre-set your perfect impact position by shifting your weight to your lead foot, opening your hips slightly toward the target, and pushing your hands ahead of the ball to create forward shaft lean."
    : drillData.title.includes("Free Train")
    ? "This is your open practice session! Show me whatever you're working on - your setup, full swing, putting stroke, chipping, or any golf movement. I'm here to provide real-time coaching feedback on anything you want to improve."
    : "Let's start by getting your setup position correct for this drill.";

  const greetingEnd = drillData.title.includes("Free Train")
    ? "I can help with any aspect of your golf game - full swing mechanics, short game technique, putting stroke, or fundamental skills. Just show me what you're working on and say 'How does that look?' for detailed feedback, or ask me specific questions about technique, swing thoughts, or any golf fundamentals you want to improve."
    : "Once you've set up according to these instructions, please say \"How does that look?\" and I'll evaluate your setup position based on what I can see in your video. I want to make sure everything looks correct before we move on to practicing the actual drill movements. This setup phase is crucial for the drill's success, so we'll take our time to get it right.";

  return `Hello! I'm your golf instructor and I'm ready to help you with ${drillData.title}. I'm receiving your audio and video feed and will analyze your form as we proceed.

${setupInstructions}

${greetingEnd}`;
}