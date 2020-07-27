import { Component, OnInit } from '@angular/core';
import { Client } from '../clients/Client';
import { Region } from '../clients/Region';
import { ClientService } from 'src/app/providers/client.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public title: string = "Añadir cliente";
  public client: Client = new Client();
  public errors: string[];
  public regions: Region[];

  constructor(private clientService: ClientService,
    private router: Router,
    private activatedRouted: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadClient()
  }

  public loadClient(): void {
    this.activatedRouted.params.subscribe(params => {
      let id = params['id']
      if(id) {
        this.title = 'Editar cliente'
        this.clientService.getClient(id).subscribe(
          res => this.client = res
        )
      }
    });
    this.clientService.getRegions().subscribe(res => this.regions = res);
  }

  public create(): void {
    this.clientService.create(this.client).subscribe(
      res => {
        this.router.navigate(['/clients'])
        Swal.fire(
          'Cliente añadido',
          `Cliente ${res.name} ha sido añadido con éxito!`,
          'success'
        )
      },
      err => {
        this.errors = err.error.errors as string[];
        console.error('STATUS: ' + err.status);
        console.error(err.error.errors);
      }
    )
  }

  public update(): void {
    this.clientService.update(this.client).subscribe(
      res => {
        this.router.navigate(['/clients'])
        Swal.fire(
          'Cliente actualizado',
          `Cliente ${res.client.name} ha sido actualizado con éxito!`,
          'success'
        )
      },
      err => {
        this.errors = err.error.errors as string[];
        console.error('STATUS: ' + err.status);
        console.error(err.error.errors);
      }
    )
  }

  compareRegion(obj1: Region, obj2: Region): boolean {
    if(obj1 === undefined && obj2 === undefined) return true;
    return obj1 === null || obj2 === null || obj1 === undefined || obj2 === undefined ? false : obj1.id === obj2.id;
  }

}
