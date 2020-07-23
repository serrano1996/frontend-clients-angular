import { Component, OnInit } from '@angular/core';
import { Client } from './Client';
import { ClientService } from '../../providers/client.service';
import { ModalService } from '../../providers/modal.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html'
})
export class ClientsComponent implements OnInit {

  clients: Client[] = [];
  paginator: any;
  clientSelected: Client;

  constructor(private clientService: ClientService,
    private activatedRouted: ActivatedRoute,
    private modalService: ModalService) { }

  ngOnInit(): void {
    this.activatedRouted.paramMap.subscribe(
      params => {
        let page: number = +params.get('page');
        if(!page) page = 0;
        this.clientService.getClients(page).subscribe(
          response => {
            this.clients = response.content as Client[];
            this.paginator = response;
          }
        )
      }
    );

    this.modalService.notifyUpload.subscribe(
      res => {
        this.clients = this.clients.map(current => {
          if(res.id == current.id) {
            current.image = res.image;
          }
          return current;
        })
      }
    );
  }

  delete(client: Client): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger mr-2'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Confimación',
      text: `¿Seguro que desea eliminar al cliente ${client.name} ${client.lastname}? Esto no podrá ser revertido`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, hazlo!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.clientService.delete(client.id).subscribe(
          res => {
            this.clients = this.clients.filter(cli => cli !== client)
            swalWithBootstrapButtons.fire(
              'Borrado',
              `Cliente ${client.name} ${client.lastname} eliminado con éxito`,
              'success'
            )
          }
        )
      }
    })
  }

  fireModal(client: Client) {
    this.clientSelected = client;
    this.modalService.showModal();
  }

}
