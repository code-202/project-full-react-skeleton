export class Store
{
    public isOpen: boolean = false

    public toggle () {
        this.isOpen = !this.isOpen
    }
}
