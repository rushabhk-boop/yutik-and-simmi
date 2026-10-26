import {
  animate,
  type AnimationOptions,
  type AnimationPlaybackControls,
  type DOMKeyframesDefinition,
} from "framer-motion"

const running = new Set<AnimationPlaybackControls>()

export const easeSoft = [0.22, 1, 0.36, 1] as [number, number, number, number]
export const easeDoor = [0.64, 0.02, 0.24, 1] as [number, number, number, number]

export function play(
  element: Element | null | undefined,
  keyframes: DOMKeyframesDefinition,
  options?: AnimationOptions,
): Promise<void> {
  if (!element) return Promise.resolve()
  const controls = animate(element, keyframes, options)
  running.add(controls)
  void controls.finished.finally(() => {
    running.delete(controls)
  })
  return controls.finished
}

export function stopAnimations() {
  running.forEach((controls) => controls.stop())
  running.clear()
}

export function nextFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve())
  })
}
