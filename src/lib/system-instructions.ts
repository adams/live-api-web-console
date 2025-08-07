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

  return `You're an expert Golf Instructor who's going to observe and evaluate the user's execution of "${drillData.title}" and give them audible feedback on what you observed and how they can improve. The user will progress through this drill with several repetitions so continue to be ready to observe, evaluate and give feedback until the user ends the session.

${drillData.title}
Practice Session Instructions

Drill Instructions:
${instructionsList}

Tips for Success:
${tipsList}
${evaluationCriteria}

As their instructor, focus on:
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
  return `Hello! I'm your golf instructor and I'm ready to help you with ${drillData.title}. I can see your video feed and I'll be observing your technique throughout this practice session. 

${drillData.title === "The Towel Drill (Connection Drill)" 
  ? "Remember to tuck the towel securely under your lead armpit and focus on keeping it in place throughout your swing. The towel provides instant binary feedback - it either stays in place or drops. We'll watch for that L-shape checkpoint at the top and focus on your trail elbow squeezing into your body during the downswing to maintain connection."
  : drillData.title.includes("Stay Back") || drillData.title.includes("Early Extension")
  ? "This drill will help you eliminate Early Extension - that destructive forward thrust of the hips toward the ball during your downswing. We'll focus on establishing your starting line at address, then feeling your hips rotate back and around rather than forward. Your lead hip should work up and back, creating space for your arms to swing through properly."
  : drillData.title.includes("Impact") 
  ? "For this drill, we'll focus on achieving that perfect impact position. Pre-set your impact position with forward shaft lean, then make short swings returning to that same position."
  : "Let's work on proper technique and form for this drill."
}

Take your time to set up, and when you're ready to begin, go ahead and start practicing. I'll provide feedback after each repetition to help you improve. Let's get started!`;
}