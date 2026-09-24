import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CardService } from '../card-service';
import { CardDataForm, CardDetails } from '../card-data';
import { ValidationErrorResponse } from '../../common/validation/validation-error-model';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

interface RegisterCardForm {
  name: FormControl<string>;
  brand: FormControl<string>;
}

@Component({
  selector: 'app-register-card',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register-card.html',
  styleUrl: './register-card.scss',
})
export class RegisterCard implements OnInit {
  form!: FormGroup<RegisterCardForm>;
  activeRoute = inject(ActivatedRoute);
  service = inject(CardService);
  toast = inject(ToastrService);
  idEditCard?: string | null;

  ngOnInit(): void {
    this.form = new FormGroup<RegisterCardForm>({
      name: new FormControl('', { nonNullable: true, validators: Validators.required }),
      brand: new FormControl('', { nonNullable: true, validators: Validators.required })
    });

    this.loadEditData();

  }

  loadEditData() {
    this.idEditCard = this.activeRoute.snapshot.queryParamMap.get('id');
    if (!this.idEditCard) {
      return;
    }

    this.service.getById(this.idEditCard).subscribe({
      next: (card) => {
        this.form.patchValue({
          name: card.name,
          brand: card.brand
        })
      },
      error: () => this.toast.error('Erro ao carregar os dados do cartão')
    })
  }

  isFormInvalid() : boolean {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error("Ocorreu um erro ao processar a requisição.");
      return true;
    } return false;
  }

  handleSubmit() {

    if (this.isFormInvalid()) {
      return;
    }

    console.log(this.form.value);
    const cardData: CardDataForm = this.form.value as CardDataForm;

    const req: Observable<CardDetails | void> = this.idEditCard ? this.service.update(this.idEditCard, cardData) : this.service.create(cardData);
    req.subscribe({
      next: (response) => {
        console.log('recebendo a resposta do servidor: ', response);
        this.toast.success("Cartão cadastrado/atualizado com sucesso!");
        this.form.reset();
        this.idEditCard = null;
      },
      error: (error) => this.onApiError(error)
    });
  }

  private applyValidationErrors(error: ValidationErrorResponse) {
    error.invalidFields.forEach(ci => {
      const control = this.form.get(ci.field);
      if (control) {
        control.setErrors({ apiError: ci.error });
        control.markAsTouched();
      }
    })
  }

  private onApiError(response: any) : void {
    if (response.status === 422) {
      this.applyValidationErrors(response.error);
      this.toast.error("Erro de validação. Verifique os valores informados.");
      return;
    }
    this.toast.error("Ocorreu um erro ao processar a requisição.");
  }
}
