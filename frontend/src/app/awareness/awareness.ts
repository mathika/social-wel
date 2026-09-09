import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-awareness',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './awareness.html',
  styleUrl: './awareness.css'
})
export class Awareness {

  selectedTopic: number | null = null;

  topics = [
    {
      icon: '💧',
      title: 'Water Conservation',
      short: 'Save water and protect our water resources.',
      description: 'Water is one of our most important natural resources. Small actions can help reduce water wastage and protect clean water for everyone.',
      report: 'Report water leakage, broken pipelines, overflowing tanks and other water-related problems through the complaint system.',
      tips: [
        'Turn off taps when not in use.',
        'Fix leaking taps and pipes quickly.',
        'Avoid wasting water while washing vehicles.',
        'Reuse water whenever possible.'
      ]
    },

    {
      icon: '🗑️',
      title: 'Waste Management',
      short: 'Keep your surroundings clean and healthy.',
      description: 'Proper waste management helps maintain a clean environment and prevents diseases and pollution in our communities.',
      report: 'Report garbage accumulation, illegal dumping and overflowing garbage bins through the complaint system.',
      tips: [
        'Separate wet and dry waste.',
        'Use dustbins properly.',
        'Avoid throwing plastic on roads.',
        'Recycle materials whenever possible.'
      ]
    },

    {
      icon: '🚰',
      title: 'Drainage Safety',
      short: 'Keep drains clean and prevent blockages.',
      description: 'Blocked drainage systems can cause waterlogging, bad odour and health problems. Keeping drains clear helps protect the community.',
      report: 'Report blocked drains, overflowing drainage systems and damaged drainage structures.',
      tips: [
        'Do not throw garbage into drains.',
        'Keep drainage openings clear.',
        'Report blocked drains immediately.',
        'Avoid dumping plastic into drainage systems.'
      ]
    },

    {
      icon: '💡',
      title: 'Streetlight & Road Safety',
      short: 'Help make roads safer for everyone.',
      description: 'Working streetlights and properly maintained roads are important for the safety of pedestrians, cyclists and drivers.',
      report: 'Report damaged streetlights, potholes and damaged roads through the complaint system.',
      tips: [
        'Report damaged streetlights.',
        'Report potholes and damaged roads.',
        'Follow traffic rules.',
        'Be careful when walking or driving at night.'
      ]
    }
  ];

  constructor(private router: Router) {}

  toggleTopic(index: number): void {
    if (this.selectedTopic === index) {
      this.selectedTopic = null;
    } else {
      this.selectedTopic = index;
    }
  }

  goBack(): void {
    window.history.back();
  }

  goToComplaint(): void {
    this.router.navigate(['/submit-complaint']);
  }
}