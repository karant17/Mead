import React from 'react'
import { authoredStoriesForUser } from '../../reducers/selectors'
import { connect } from 'react-redux'
import { fetchUser } from '../../actions/user_actions'
import ProfileContent from './profile_content'
import MainIndex from '../main/main_index'

class ProfileShow extends React.Component {

  constructor (props) {
    super(props)
    this.state = { loading: true }
  }

  componentDidMount () {
    this.props.fetchUser(this.props.match.params.id).then(
      success => this.setState({ loading: false })
    )
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {

      this.setState({ loading: true })

      this.props.fetchUser(nextProps.match.params.id).then(
        success => this.setState({ loading: false })
      )
    }
  }

  render () {
    if (this.state.loading) {
      return <div></div>
    }

    let currentMatch

    if (this.props.currentUserId === this.props.user.id) {
      currentMatch = true
    }
    
    return (
      <div className="profile-show">
        <ProfileContent 
          user={this.props.user} 
          currentMatch={currentMatch} />
        <MainIndex 
          stories={this.props.userStories} 
          editButton={true}
          additionalClasses="profile-view" />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.match.params.id
  const user = state.entities.users[id]
  let userStories

  if (user.authored_story_ids) {
    userStories = authoredStoriesForUser(state, user)
  }

  return {
    user,
    userStories,
    currentUserId: state.session.id
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchUser: id => dispatch(fetchUser(id))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileShow)