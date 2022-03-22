import { Header, Menu } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useStore } from 'app/stores/store';
import Calendar from 'react-calendar';

export default observer(function ActivityFilter() {
    const { activityStore } = useStore();
    const { loadActivities, activities } = activityStore;


    return (
        <>
            <Menu vertical size='large' style={{ width: '100%' }}>
                <Header icon='filter' attached color='teal' content='filters' />
                <Menu.Item content='All activities' />
                <Menu.Item content="I'm going" />
                <Menu.Item content="I'm hosting" />
            </Menu>
            <Header />
            <Calendar />
        </>
    )
})