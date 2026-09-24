import { Component, inject, OnInit } from '@angular/core';
import { CardService } from '../card-service';
import { Observable } from 'rxjs';
import { PageResult } from '../../common/pagination/page-result';
import { CardDetails } from '../card-data';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cards-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './cards-list.html',
  styleUrl: './cards-list.scss',
})
export class CardsList implements OnInit {

  service = inject(CardService);
  router = inject(Router);
  toast = inject(ToastrService);
  list$!: Observable<PageResult<CardDetails>>;
  currentPage = 0;
  pageSize = 10;

  ngOnInit(): void {
    this.listCards();
  }

  listCards() {
    this.list$ = this.service.list(this.currentPage, this.pageSize);
  }

  navigate(page: number) {
    this.currentPage = page;
    this.listCards();
  }

  navigateNext(list: PageResult<CardDetails>) {
    if(!list.last) {
      this.navigate(list.number + 1);
    }
  }

  navigatePrevious(list: PageResult<CardDetails>) {
    if(!list.first) {
      this.navigate(list.number - 1);
    }
  }

  pages(totalPages: number) : number[] {
    return Array.from({ length: totalPages }, (value, index) => index);
  }

  initalRegister(list: PageResult<CardDetails>) {
    if (list.totalElements === 0) {
      return 0;
    }

    return (list.number * list.size) + 1;
  }

  finalRegister(list: PageResult<CardDetails>) {
    if (list.totalElements === 0) {
      return 0;
    }

    return Math.min((list.number + 1) * list.size, list.totalElements);
  }

  prepareEdit(id: string) {
    this.router.navigate(['/pages/register-cards'], {
      queryParams: {
        id: id
      }
    });
  }

  changeStatus(cardId: string) {
    this.service.changeStatus(cardId).subscribe(next => {
      this.toast.success("Registro atualizado com sucesso!");
      this.listCards();
    })
  }
}
