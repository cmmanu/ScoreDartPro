import { Component, AfterViewInit } from '@angular/core';
import { ScoresComponent } from './scores/scores.component';
import { DartersComponent } from './darters/darters.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [ScoresComponent, DartersComponent, RouterModule]
})
export class AppComponent implements AfterViewInit {
  ngAfterViewInit() {
    const divider = document.getElementById('divider');
    const leftPane = document.getElementById('movable-left');
    const container = document.getElementById('movable-container');

    if (!divider || !leftPane || !container) return;

    let isDragging = false;

    const startDragging = (event: MouseEvent | TouchEvent) => {
      isDragging = true;
      document.body.style.cursor = 'col-resize';
      event.preventDefault(); // Prevent text selection or scrolling
    };

    const stopDragging = () => {
      isDragging = false;
      document.body.style.cursor = 'default';
    };

    const resize = (event: MouseEvent | TouchEvent) => {
      if (!isDragging) return;

      const containerRect = container.getBoundingClientRect();
      const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
      const newLeftWidth = clientX - containerRect.left;

      // Set minimum and maximum widths for the left pane
      const minWidth = 100; // Minimum width for the left pane
      const maxWidth = containerRect.width - 100; // Minimum width for the right pane

      if (newLeftWidth > minWidth && newLeftWidth < maxWidth) {
        leftPane.style.flex = `0 0 ${newLeftWidth}px`;
      }
    };

    // Attach event listeners
    divider.addEventListener('mousedown', startDragging);
    divider.addEventListener('touchstart', startDragging);

    document.addEventListener('mousemove', resize);
    document.addEventListener('touchmove', resize);

    document.addEventListener('mouseup', stopDragging);
    document.addEventListener('touchend', stopDragging);
  }
}