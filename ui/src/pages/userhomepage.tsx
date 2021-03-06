import m from 'mithril';
import { Page } from "../components/page";
import { AuthClient } from '../generic/login/authclient';
import { Todo} from '../todo'
import { WithSpinner } from '../components/withspinner';

export class UserHomePage {

    results:Todo[] = [];
    loading = true;

    async oninit() {
        await this.refresh();
    }

    view() {
        return <Page>
            <input id="newTodo" autocomplete="no" class="w-full h-20 px-5 text-xl" type="text" placeholder="What needs to be done?" onchange={() => this.createTodo()}/>
            <WithSpinner loading={this.loading}>
                <ul>
                    {this.results.map((t:Todo) => <li class="h-20 border-b-2 w-full hover:bg-gray-200 flex items-center px-5 text-xl justify-between">
                        <div>{t.title}</div> 
                        <button class="focus:outline-none" onclick={() => this.deleteTodo(t)}>×</button>
                    </li>)}
                </ul>
            </WithSpinner>
        </Page>
    }

    async deleteTodo(todo:Todo){
        await m.request({
            method: 'DELETE',
            url: '/api/private/todo?id=' + todo.taskId,
        });
        await this.refresh();
    }

    async createTodo(){
        let input = document.getElementById('newTodo') as HTMLInputElement;
        let todo:Todo = {
            title: input.value,
        }
        await m.request({
            method: 'POST',
            url: '/api/private/todo',
            body: todo
        });
        input.value = '';
        await this.refresh();
    }

    async refresh(){
        this.loading = true;
        m.redraw()
        this.results = await m.request({
            url: '/api/private/todos'
        })
        this.loading = false;
        m.redraw();
        document.getElementById('newTodo').focus();
    }

}