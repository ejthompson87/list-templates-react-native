import { ActiveListItemModel } from './ActiveListItemModel';

export interface ActiveListModel {
    id: string;
    title: string;
    items: Array<ActiveListItemModel>;
}