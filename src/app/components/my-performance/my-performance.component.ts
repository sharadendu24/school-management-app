import { Component, OnInit } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { TabViewModule } from 'primeng/tabview';
import { baseUrl } from '../../constants/urls';
import { HttpClient } from '@angular/common/http';
import {
  ExamResult,
  GetMarksResponse,
  GroupedMark,
} from '../../interfaces/common';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { NgFor, NgIf } from '@angular/common';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-my-performance',
  imports: [TabsModule, TabViewModule, TableModule, NgFor, NgIf, ChartModule],
  templateUrl: './my-performance.component.html',
  styleUrl: './my-performance.component.scss',
  providers: [MessageService],
})
export class MyPerformanceComponent implements OnInit {
  marksResult: GetMarksResponse[] = [];
  searchUsername: string = '';

  groupedMarks: any[] = [];
  examColumns: string[] = [];

  chartData: any = {
    labels: ['Math', 'Science', 'Hindi', 'English', 'Social Science', 'Arts'],
    datasets: [
      {
        label: 'Marks Obtained',
        data: [85, 78, 92, 88, 76, 95],
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'rgb(255, 255, 255)',
        pointBorderColor: '#000',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(54, 162, 235)',
      },
      {
        label: 'Mid-term Exam',
        data: [78, 85, 88, 90, 82, 89], // New exam data
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)', // Different color
        borderColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: '#fff',
      },
      {
        label: 'Final Exam',
        data: [92, 88, 95, 85, 90, 93], // New exam data
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Different color
        borderColor: 'rgb(75, 192, 192)',
        pointBackgroundColor: '#fff',
      },
    ],
  };

  chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 10,
          color: '#495057',
          backdropColor: 'transparent',
          autoSkip: false,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        pointLabels: {
          color: '#495057',
          font: {
            weight: 'bold',
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true, // Changed from false to show legend
        position: 'top', // Options: 'top', 'left', 'right', 'bottom', 'chartArea'
        align: 'end', // Aligns legend to end (right side) of container
        
      },
      title: {
        display: true,
        text: 'Subject Performance Analysis',
        color: '#2c3e50',
        font: {
          size: 18,
          weight: 'bold',
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
  };

  constructor(
    private readonly http: HttpClient,
    private readonly messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getMarks();
  }

  getMarks() {
    const url = `${baseUrl}exam/myMarks`;
    this.http.get<any>(url).subscribe({
      next: (response) => {
        this.marksResult = response.data || response;
        this.processData();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Fetched Marks for the student.',
        });
      },
      error: (error) => {
        console.error('Error fetching marks', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            error.error.errors[0].errorMessage || 'Error while fetching Mark.',
        });
        this.marksResult = [];
        this.processData();
      },
    });
  }

  processData() {
    const grouped: { [key: string]: GroupedMark } = {};

    this.marksResult.forEach((entry) => {
      const key = `${entry.subjectCode}-${entry.subjectName}`;

      if (!grouped[key]) {
        grouped[key] = {
          subjectName: entry.subjectName,
          subjectCode: entry.subjectCode,
          exams: {},
        };
      }

      // Add type assertion for exam result
      grouped[key].exams[entry.examName] = {
        status: entry.status,
        maxMarks: entry.maxMarks,
        marksObtained: entry.marksObtained,
      } as ExamResult;
    });

    this.groupedMarks = Object.values(grouped);
    this.examColumns = [...new Set(this.marksResult.map((m) => m.examName))];
    this.chartData = this.processMarksDataForChart(this.marksResult);
  }

  // Update getExamData with proper typing
  getExamData(
    exams: { [examName: string]: ExamResult },
    examName: string
  ): ExamResult | null {
    return exams[examName] || null;
  }

  //Chart related Methods---------------

  processMarksDataForChart(marksResult: any[]): any {
    console.log('Processing result for char prep.');
    // Get all unique exams and subjects
    const exams = [...new Set(marksResult.map((m) => m.examName))].sort();
    const subjects = [...new Set(marksResult.map((m) => m.subjectName))].sort();

    // Color palette for up to 7 exams
    const colorPalette = [
      { bg: 'rgba(54, 162, 235, 0.2)', border: 'rgb(54, 162, 235)' },
      { bg: 'rgba(255, 99, 132, 0.2)', border: 'rgb(255, 99, 132)' },
      { bg: 'rgba(75, 192, 192, 0.2)', border: 'rgb(75, 192, 192)' },
      { bg: 'rgba(153, 102, 255, 0.2)', border: 'rgb(153, 102, 255)' },
      { bg: 'rgba(255, 159, 64, 0.2)', border: 'rgb(255, 159, 64)' },
      { bg: 'rgba(255, 205, 86, 0.2)', border: 'rgb(255, 205, 86)' },
      { bg: 'rgba(201, 203, 207, 0.2)', border: 'rgb(201, 203, 207)' },
    ];

    // Create datasets for each exam
    const datasets = exams.map((exam, index) => {
      const color = colorPalette[index % colorPalette.length];

      // Create data array for each subject
      const data = subjects.map((subject) => {
        const record = marksResult.find(
          (m) => m.examName === exam && m.subjectName === subject
        );

        // Return 0 for absent/missing marks
        return record &&
          record.marksObtained !== null
          ? record.marksObtained
          : 0;
      });

      return {
        label: exam,
        data: data,
        fill: true,
        backgroundColor: color.bg,
        borderColor: color.border,
        pointBackgroundColor: 'rgb(255, 255, 255)',
        pointBorderColor: '#000',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: color.border,
      };
    });
    console.log({
      labels: subjects,
      datasets: datasets,
    });

    return {
      labels: subjects,
      datasets: datasets,
    };
  }
}
