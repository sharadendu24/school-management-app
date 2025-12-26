// lesson-chat.component.ts
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { baseUrl } from '../../constants/urls';

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
  isError?: boolean;
}

@Component({
  selector: 'app-lesson-chat',
  standalone: true,
  imports: [
    CommonModule, 
    ButtonModule, 
    ScrollPanelModule, 
    InputTextModule, 
    FormsModule
  ],
  templateUrl: './lesson-chat.component.html',
  styleUrls: ['./lesson-chat.component.scss']
})
export class LessonChatComponent {
  
  private sanitizer = inject(DomSanitizer);

  @Output() close = new EventEmitter<void>();

  constructor(private http: HttpClient) {}
  
  userMessage = '';
  messages: ChatMessage[] = [];
  loading = false;
  apiUrl = `${baseUrl}api/gemini/generate`;

  async sendMessage() {
    if (!this.userMessage.trim()) return;

    const userMessage = this.userMessage;
    this.messages.push({
      text: userMessage,
      isUser: true,
      timestamp: new Date()
    });
    
    this.userMessage = '';
    this.loading = true;

    try {
      const response = await this.http.post<any>(this.apiUrl, userMessage).toPromise();

      const aiResponse = response?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response found';
      this.addAiMessage(aiResponse);
    } catch (error) {
      this.addErrorMessage('Failed to get response. Please try again.');
    } finally {
      this.loading = false;
    }
  }

  private addAiMessage(text: string) {
    this.messages.push({
      text: text,
      isUser: false,
      timestamp: new Date(),
      isError: false
    });
  }

  private addErrorMessage(text: string) {
    this.messages.push({
      text: text,
      isUser: false,
      timestamp: new Date(),
      isError: true
    });
  }

  formatContent(text: string) {
    const formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
    return this.sanitizer.bypassSecurityTrustHtml(formatted);
  }
}