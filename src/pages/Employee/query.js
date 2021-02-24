import { gql } from '@apollo/client';

const GET_EMPLOYEES = gql`
query GetEmployees {
  getEmployees {
    name
    role
    parent
    ancestors
  }

  }
`;

export default GET_EMPLOYEES;
