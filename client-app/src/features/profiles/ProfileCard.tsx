import React from 'react';
import { Profile } from '../../app/models/profile';
import { Card, Icon, Image } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
interface Props{
    profile: Profile
}

export default function ProfileCard({profile} : Props){
    return (
        <Card as={Link} to={`/profiles/${profile.userName}`}>
            <Image src={profile.image || '/assets/user.png'}/> 
            <Card.Content>
                <Card.Header content={profile.displayName}/>
                <Card.Description content={profile.bio}/>
            </Card.Content>
            <Card.Content extra>
                <Icon name="user"/> {profile.folowersCount || 0} folowers
            </Card.Content>
        </Card>
    )
}