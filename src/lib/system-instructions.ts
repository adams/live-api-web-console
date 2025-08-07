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
    : drillData.title.includes("Impact") 
    ? "First, let's get your setup position correct. Take your normal address position, then pre-set your perfect impact position by shifting your weight to your lead foot, opening your hips slightly toward the target, and pushing your hands ahead of the ball to create forward shaft lean."
    : "Let's start by getting your setup position correct for this drill.";

  return `Hello! I'm your golf instructor and I'm ready to help you with ${drillData.title}. I can see your video feed clearly.

${setupInstructions}

Once you've set up according to these instructions, please say "How does that look?" and I'll evaluate your setup position. I want to make sure everything looks correct before we move on to practicing the actual drill movements. This setup phase is crucial for the drill's success, so we'll take our time to get it right.`;
}