# Ben 10 GLB Models

Drop your converted GLB files into these folders. Missing files fall back to procedural animation automatically.

## Four Arms (with skin)
```
public/models/fourarms/
  character.glb      ← Full Mixamo character WITH skin
  farun.glb
  fajump.glb
  fapunch1.glb
  fapunch2.glb
  fastrongpunch.glb
  (idle/walk/fall/land → procedural fallback)
```

## XLR8 (shared rig, no skin)
```
public/models/xlr8/
  xlr8speedup.glb    ← Plays when sprinting (hold SHIFT / BOOST button)
```

## Shared Humanoid Rig (used by all other aliens)
```
public/models/shared/
  humanoid_rig.glb   ← Bones ONLY, no skin (drives buildMesh() geometry)
  idle.glb
  run.glb
  jump.glb
  punch1.glb         ← Attack variant 1 (cycles each press)
  punch2.glb         ← Attack variant 2
  punch3.glb         ← Attack variant 3
  (walk/fall/land → procedural fallback)
```

## Mixamo Export Reminder
- Format: FBX Binary → convert to GLB at aspose.com/3d/app/conversion/fbx-to-glb
- FPS: 30 | Keyframe reduction: Uniform
- Four Arms: export WITH skin
- Everything else: export WITHOUT skin (bones only)

## Attack Cycling
Each press of ATTACK (F key / ATTACK button) cycles:
  punch1 → punch2 → punch3 → punch1 → ...
For Four Arms: fapunch1 → fapunch2 → fastrongpunch → fapunch1 → ...

## XLR8 Speedup
`xlr8speedup.glb` plays automatically when XLR8 is sprinting (SHIFT held or BOOST button).
Normal run plays when jogging without sprint.
