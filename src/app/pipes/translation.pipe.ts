import { Pipe, PipeTransform } from '@angular/core';
import {TranslationService} from '../services/translation.service';

@Pipe({
  name: 'translate',
  pure: false
})
export class TranslationPipe implements PipeTransform {
  constructor(
    private translationService: TranslationService,
  ) {}

  public transform(key: any): any {
    return this.translationService.data[key] || key;
  }
}
