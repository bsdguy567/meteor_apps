import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Tasks } from '../../api/tasks.js';

import template from './todosList.html';

class TodosListCtrl {
    constructor($scope) {
        $scope.viewModel(this);

        this.hideCompleted = false;

        this.helpers({
            tasks() {
                const selector = {};
                //The query that returns all tasks(the current query looks like that:
                //  Tasks.find({}, { sort: { createdAt: -1 } }
                //and the query to return only the not completed todos looks like that:
                //  Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } })

                // If hide completed is checked, filter tasks
                if (this.getReactively('hideCompleted')) {
                    selector.checked = {
                        $ne: true
                    };
                }

                // Show newest tasks at the top
                return Tasks.find(selector, {}, {
                    sort: {
                        createdAt: -1
                    }
                });
        })
    }


    addTask(newTask) {
        // Insert a task into the collection
        Tasks.insert({text: newTask, createdAt: new Date});

        // Clear form
        this.newTask = '';
    }
    
    //To watch checked state of each task.
    //  ng-checked="task.checked"
    //And to change current state by calling setChecked method of the controller.
    //  ng-click="$ctrl.setChecked(task)"

    setChecked(task) {
        // Set the checked property to the opposite of its current value
        Tasks.update(task._id, {
            $set: {
                checked: !task.checked
            },
        });
    }

    removeTask(task) {
        Tasks.remove(task._id);
    }
}



export default angular.module('todosList', [
    angularMeteor
])
    .component('todosList', {
        templateUrl: 'imports/components/todosList/todosList.html',
        controller: TodosListCtrl
    });