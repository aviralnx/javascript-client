import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import Button from '@material-ui/core/Button';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { AddDialog, Table } from './components';
import { withLoaderAndMessage } from '../../components';
import GET_EMPLOYEES from './query';
import CREATE_EMPLOYEE from './mutation';
import { SnackBarContext } from '../../contexts';

const Employee = () => {
  const [open, setOpen] = useState(false);

  const {
    data, loading, refetch,
  } = useQuery(GET_EMPLOYEES);
  let tableRecord;
  if (!loading && data) {
    tableRecord = data.getEmployees;
  }

  const [addEmployee] = useMutation(CREATE_EMPLOYEE);

  const handleAddClickOpen = () => {
    setOpen(true);
  };
  const handleAddSubmit = async (newEmployee, openSnackBar) => {
    try {
      const response = await addEmployee({
        variables:
        { name: newEmployee.name, role: newEmployee.role, parent: newEmployee.parent },
      });
      const { data: { createEmployee: { message } } } = response;
      if (message) {
        openSnackBar(message, 'error');
      } else {
        refetch();
        setOpen(false);
        openSnackBar('Employee added successfully', 'success');
      }
    } catch (error) {
      openSnackBar('Cannot added trainee', 'error');
      console.log(error);
    }
  };

  const handleAddClose = () => {
    setOpen(false);
  };

  const EnhancedTable = withLoaderAndMessage(Table);

  const getLevels = () => {
    const levels = [];
    if (!loading) {
      tableRecord.map((employee) => (
        levels.push(employee.role)
      ));
    }
    const uniqueLevels = [...new Set(levels)];
    return uniqueLevels;
  };

  return (
    <SnackBarContext.Consumer>
      {
        ({ openSnackBar }) => (
          <>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<PersonAddIcon />}
              onClick={handleAddClickOpen}
              style={{ marginBottom: '20px' }}
            >
              Add Employee
            </Button>
            <AddDialog
              open={open}
              onClose={handleAddClose}
              onSubmit={(newEmployee) => handleAddSubmit(newEmployee, openSnackBar)}
              loading={loading}
            />
            <EnhancedTable
              data={tableRecord}
              columns={getLevels()}
              loading={loading}
              dataCount={!loading && tableRecord.length}
              message="No Employees Found"
            />
          </>
        )
      }
    </SnackBarContext.Consumer>
  );
};

export default Employee;