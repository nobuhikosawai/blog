---
title: Behind the eraser
date: 2022-10-29
---

You are familiar with eraser on the paper but when it comes to implementing it on the online whiteboard, it becomes a very different story.
A bit while ago, I have implemented the eraser feature for an online whiteboard, so I wanted to write down my experience and things I learned.

You can find the brief gif of what I have implemented [here](https://blog.classdo.com/en/sketchpad-enhancement-make-fine-corrections-with-eraser).

# Acknowledgement

Our online whiteboard application uses vector data (JSON data saving the coordination of mouse events.), not rasterized data.

# Spec

Eraser on the online whiteboard is not as straightforward as you hear. You have to carefully consider the spec first.

There are actually three possible specs.

1. Splitting annotations with an eraser tool

This is probably the spec that you would come up in the first place and more intuitive one because this is more close to the eraser in the physical world.
Eraser will detect the collisions with annotations and split them with new small annotations.
You can find more detailed discussion and explanation on [this issue comment of excalidraw](https://github.com/excalidraw/excalidraw/issues/3500#issuecomment-826685538)

![Screenshot 2023-01-27 at 10.21.22](/splitting.png)

As described above, this spec is intuitive to users but the implementation is probably very difficult especially if the data is vector data (not raster) . Also, users have to manage all the chunks split by the eraser and this is not very handy.

2. Drawing eraser objects on top of pen annotations.

The second example from [this issue comment](https://github.com/excalidraw/excalidraw/issues/2052#issuecomment-965058960) is probably the best example. You will draw transparent annotations on top of pen objects. This can be achieved by using canvas's [globalCompositeOperation](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation) especially like `destination-out` (the demo gif is using other property than destination-out, I think).

![](https://user-images.githubusercontent.com/23072548/141106948-aba7b3bb-27f6-43fc-997c-82f97c3a57f8.gif)

(The gif is from the [issue](https://github.com/excalidraw/excalidraw/issues/2052#issuecomment-965058960))

The good side of this spec is this still has somewhat physical eraser experience without needing very difficult calculation. The downside is if you move annotations around and the erased shape comes on top of the non-erased shape then the non-erased shape also look as if is deleted, which is not very intuitive.

3. Deleting the whole shape

This spec will create a tool that, as you drag, would delete any shape that it collides with, and call it eraser. The behavior is simply same as 'delete an annotation'.

![](https://user-images.githubusercontent.com/23072548/141107275-695217ab-de85-4954-8d86-3b59ed0da45f.gif)

(The gif is from the [issue](https://github.com/excalidraw/excalidraw/issues/2052#issuecomment-965058960))

The good side of this approach is the implementation can be very simple.

With these three options, I chose #2 for our application because our app users wanted to have more whiteboard like experience. We added the spec limitation that the erased shape cannot be moved around to reduce the strange feeling. 

# Data Structure

With #2 approach, the eraser stroke is also another shape but we don't want to treat it as the different shape. Instead, we want to treat the erased shape and eraser stroke itself altogether. To achieve so, we need to group both the erased shape and eraser strokes. In our case, we already used [Konva](https://konvajs.org), so I used its group feature. 

The type of an erased shape and eraser strokes would be something like this:

```TypeScript
export type ErasableShape = PathShape | LineShape | RectShape | EllipseShape

export interface EraserShape { // Just another type of Path.
  type: 'eraser'
  points: [number, number][]
  strokeWidth: number
}

export interface EraserGroupShape<T extends ErasableShape = ErasebleShape> {
  type: 'erasergroup'
  children: [T, ...EraserShape[]]
  x: number
  y: number
  width: number
  height: number
  ...
}

```

In our app, to avoid saving unnecessary data, the eraser stroke that does not delete anything (i.e. outside of shapes) are omitted and unsaved.

# Algorithms

## Overall algorithms

To erase a shape, you have to detect if the current cursor is overlapping any shape. More precisely, you have to detect if the line segment comprised of the current cursor position and the previous position is intersecting a shape. If this line intersects a shape then it is erased.

![image-20230128011939913](/intersecting.png)

The other case you should consider is when the shape stroke is very thick. In this case, although the line segment of pervious point and the current point does not intersect a shape, because the stroke is thick, it would look as if the eraser is overlapping an underlying shape. In this case the current point have to be considered as an effective eraser stroke.

![image-20230128012004883](/close-to-shape.png)

To sum up, the intersection detection would be the following:

1. Detect if an eraser stroke (line segments created by current point and the previous point) is intersecting any shapes.
2. Detect if current point is close enough (threshold depends on stroke width) to a shape. (In real-world example, I did this check only when the shape stroke is above some threshold.)
3. If any of the above is yes, the shape is considered as 'erased'.

To treat a shape as being erased, group a shape with eraser stroke. (Convert to a EraserGroupShape in our case.) During this process, remember to clip eraser stroke to save only the effective ones.

When deleting a path, the final result would be like this.

![image-20230128022418822](/clip-with-line.png)

When erasing a rectangle shape, then it would be like this.

![image-20230128022712513](/clip-with-rect.png)

## Intersection detection & clipping

We need two geometry calculations, intersection detection and line clipping. There are algorithms and mathematical calculation depending on what type of shape a line segment is interacting with.

I'm listing some of the algorithms or piece of codes that I have used. Some of them is just a math but there are  interesting computer algorithms too.

I have created the [Github repo](https://github.com/nobuhikosawai/drawing-tool-utils) for the actual working code of the following algorithms. You can check it out if you are interested.

### Line-segment vs Line-segment

#### Intersection detection

There are [math equation](https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection#Given_two_points_on_each_line_segment) for this.

#### Thick-line intersection detection

In this case, treat thick shape as rectangle and detect the intersection.

```ts
(
  l: LineSegment,
  polyline: Polyline,
  option: Option
): boolean => {
  if (polyline.strokeWidth > option.threshold) {
    for (let i = 0; i < polyline.points.length - 1; i++) {
      const p1 = polyline.points[i];
      const p2 = polyline.points[i + 1];

      const rect = lineToRect(p1, p2, polyline.strokeWidth);
      const intersecting = intersectsRect(l, rect);
      if (intersecting) {
        return true;
      }
    }
    return false;
  } else {
    for (let i = 0; i < polyline.points.length - 1; i++) {
      const p1 = polyline.points[i];
      const p2 = polyline.points[i + 1];

      const interscting = intersectsLineSegment(l, [p1, p2]);
      if (interscting) {
        return true;
      }
    }
    return false;
  }
}
```

#### Clipping

There is no specific clipping for line-segments because you only need points that is detected as intersction.

### Line-segment vs Rectangle

For this one, intersecting detection and clipping can be solved by the same algorithm. There are actually some algorithm for this one. One you might find interesting is [Cohen–Sutherland algorithm](https://en.wikipedia.org/wiki/Cohen%E2%80%93Sutherland_algorithm). 

The one I used was [Liang–Barsky algorithm,](https://en.wikipedia.org/wiki/Liang%E2%80%93Barsky_algorithm) which is apparently more efficient than [Cohen–Sutherland](https://en.wikipedia.org/wiki/Cohen–Sutherland).

### Line-segment vs Ellipse

Unfortunately I could not find the easy answer for this, so I had to solve the equation by myself.

## Distance

### To line-Segment

This [stackoverflow](https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment#comment87713907_849211) is helpful for this one.

### To Rectangle

Rectangle is composed of 4 line-segment, so this one is pretty straight forward.

### To Ellipse

This one is very very tricky. This [stackoverlfow](https://stackoverflow.com/questions/22959698/distance-from-given-point-to-given-ellipse/46007540#46007540) is quite helpful for this one but if you want to read more math behind it, you can read [this](https://blog.chatfield.io/simple-method-for-distance-to-ellipse/) for further understanding.

