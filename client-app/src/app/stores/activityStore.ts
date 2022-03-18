import agent from 'app/api/agent';
import { Activity } from 'app/models/activity'
import { makeAutoObservable, runInAction } from 'mobx'
import { v4 as uuid } from 'uuid';

export default class ActivityStore {
    activities = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false
    constructor() {
        makeAutoObservable(this)
    }

    get activitiesByDate(){
        return Array.from(this.activities.values()).sort((a,b) => 
            Date.parse(a.date) - Date.parse(b.date));
    }
    loadActivities = async () => 
    {
        this.setLoadingInitial(true);
        const activities = await agent.Activities.list();
        try {
            // Не пихать async\await внутрь
            activities.forEach(x => {
                x.date = x.date.split('T')[0];
                this.activities.set(x.id, x)
            })
            this.setLoadingInitial(false);

        }
        catch (e) {
            console.log(e);
            this.setLoadingInitial(false);
        }
    }
    setLoadingInitial = (state: boolean) => 
    {
        this.loadingInitial = state;
    }
    selectActivity = (id: string) => 
    {
        this.selectedActivity = this.activities.get(id);
    }
    cancelSelectedActivity =() => {
        this.selectedActivity = undefined;
    }
    openForm = (id?: string) => {
        id ? this.selectActivity(id) : this.cancelSelectedActivity();;
        this.editMode = true;
    }
    closeForm = () => {
        this.editMode = false;
    }
    createActivity = async (activity: Activity) => {
        this.loading = true;
        activity.id = uuid(); 
        try {
            await agent.Activities.create(activity);
            runInAction(() => { 
                this.activities.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            });
            
        } catch (error) {
            console.log(error);
            runInAction(() => { 
                this.loading = false;
            });
        }
    }
    updateActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() => { 
                this.activities.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => { 
                this.loading = false;
            });
        }
    }
    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => { 
                this.activities.delete(id);
                if (this.selectedActivity?.id === id)
                    this.cancelSelectedActivity();
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => { 
                this.loading = false;
            });
        }
    }
}