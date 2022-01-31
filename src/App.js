import { useEffect, useState } from 'react'
import Button from "./components/Button";
import Card from "./components/Card";

function App() {
  const [number, setNumber] = useState([]);
  const [isPercen, setIsPercen] = useState([]);
  const [result, setResult] = useState('');
  const [operator, setOperator] = useState([]);
  const [isComa, setIsComa] = useState(false);

  const formatNumber = (number) => {
    let numAfterComa = null;
    numAfterComa = number.split(",")[1];
    number = number.split(",")[0];
    const isNegative = number[0] == '-' ? true : false;
    const numberString = number.replace(/[^\d]/g, '').toString();
    const split = numberString.split();
    const totalSisa = split[0].length % 3;
    let sisa = split[0].substring(0, totalSisa);
    const ribuan = split[0].substring(totalSisa).match(/\d{3}/gi);
    if(ribuan){
      const separator = totalSisa ? '.' : '';
      sisa += separator + ribuan.join('.');
      return `${isNegative ? '-' : ''}${sisa}${numAfterComa ? ',' + numAfterComa : ''}`;
    }
    return `${number}${numAfterComa ? ',' + numAfterComa : ''}`;
  }

  const calculateResult = () => {
    if(number.length > 1 && number[operator.length] !== '-'){
      let newOperator = [];
      let newNumber = [];
      number.forEach((num, index) => {
        const numIsNegative = num[0] == '-';
        num = parseFloat(num.replace(/[.]/g, '').replace(',', '.'));
        num = isPercen.includes(index) ? num / 100 : num;
        num = `${numIsNegative ? '-' : ''}${num}`;
        let currentNumIsNegative = false;
        if(number[index - 1] !== undefined){
          currentNumIsNegative = number[index - 1][0] == '-';
        }
        let currentNum = number[index - 1] === undefined ? 0 : parseFloat(number[index - 1].replace(/[.]/g, '').replace(',', '.'));
        currentNum = isPercen.includes(index - 1) ? currentNum / 100 : currentNum;
        currentNum = `${currentNumIsNegative ? '-' : ''}${currentNum}`;
        let updateNewNum = false;
        if(operator[index - 1] === '*' || operator[index - 1] === '/'){
          if(operator[index - 2] === '*' || operator[index - 2] === '/'){
            updateNewNum = true;
          }
          if(operator[index - 1] === '*'){
            if(updateNewNum){
              newNumber[newNumber.length - 1] *= num;
            }else{
              newNumber.push(currentNum * num);
            }
          }else{
            if(updateNewNum){
              newNumber[newNumber.length - 1] /= num;
            }else{
              newNumber.push(currentNum / num);
            }
          }
        } else if(number.length === index + 1){
          newNumber.push(num);
        } else if(operator[index] === '-' || operator[index] === '+'){
            newNumber.push(num);
        }

        if(operator[index] === '-' || operator[index] === '+'){
          newOperator.push(operator[index]);
        }
      });
      console.log(newNumber);
      if(newOperator.length == 0){
        newNumber[0] = newNumber[0].toString().replace('.', ',');
        setResult(formatNumber(newNumber[0].toString()));
      }else{
        let calculatingNumber = newNumber.reduce((accumulator, currentValue, index) => {
          accumulator = parseFloat(accumulator);
          currentValue = parseFloat(currentValue);
          if(newOperator[index - 1] == undefined || newOperator[index - 1] == '+'){
            return accumulator + currentValue;
          }else if(newOperator[index - 1] == '-'){
            return accumulator - currentValue;
          }
        });
        calculatingNumber = calculatingNumber.toString().replace('.', ',');
        setResult(formatNumber(calculatingNumber.toString()))
      }
    }else if(number[0] !== undefined){
      setResult('');
    }
  }
  
  const addNumber = (value) => {
    setNumber((number) => {
      if(number[operator.length] !== undefined){
        if(number[operator.length].replace(/[-.,]/g,'').length >= 15){
          alert('tidak bisa menambhakn nilai lebih dari 15 digit');
          return number;
        }
      }
      const fullNumber = [...number];
      number = number[operator.length] == undefined ? '' : number[operator.length];
      if(number == '0'){
        number = '';
      } 
      const newNumber = formatNumber(number + value);
      fullNumber[operator.length] = newNumber;
      return fullNumber;
    });
  }

  useEffect(() => {
    calculateResult();
  }, [number, isPercen]);

  const addOperator = (newOperator) => {
    if(result !== '' && number.length == 0){
      setNumber([result]);
      setOperator([newOperator]);
    } else {
      setOperator(operator => {
        if(number[operator.length] === undefined || number[operator.length] === ""){
          return operator;
        }
        const result = [...operator, newOperator];
        return result;
      });
    }
  }
  const backSpace = () => {
    if(isPercen.includes(operator.length)){
      setIsPercen(percen => {
        const newPercen = [...percen];
        newPercen.pop();
        return newPercen;
      });
      return false;
    }
    if(operator.length === number.length){
      setOperator((operator) => {
        const newOperator = [...operator]
        newOperator.pop();
        return newOperator;
      });
    }else{
      setNumber(number => {
        const newArray = [...number];
        if(newArray[operator.length].length === 1){
          newArray.pop();
          return newArray;
        }
        if(newArray[operator.length][newArray[operator.length].length - 1] == ','){
          setIsComa(false);
        }
        newArray[operator.length] = formatNumber(newArray[operator.length].substring(0, newArray[operator.length].length - 1));
        return newArray;
      });
    }
  }

  const setNumberToNegative = () => {
    setNumber(number => {
      const newNumber = [...number];
      newNumber[operator.length] = `-${newNumber[operator.length] == undefined ? '' : newNumber[operator.length]}`;
      return newNumber;
    })
  }
  
  const saveResult = () => {
    setNumber([]);
    setOperator([]);
  }

  return (
    <div className='bg-gray-100 dark:bg-gray-900 flex justify-center items-start min-h-screen font-sans antialiased'>
      <Card>
        <div className="h-52 w-full p-2 text-right">
          <div className="text-gray-700 dark:text-gray-100 text-3xl h-32 overflow-y-auto px-4 scrollbar-thin hover:scrollbar-thumb-gray-200 scrollbar scrollbar-track-transparent font-semibold">
            {number.map((num, index) => (
              <div key={index}>
                {operator[index - 1] !== undefined ?
                <span className={`text-green-500 text-4xl ${operator[index - 1] === "*" ? '' : 'mr-1'}`}>
                  {operator[index - 1] === "*" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 m-0 p-0 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : operator[index - 1]}
                </span>
                : ""
                }
                <span>
                  {num}{isPercen.includes(index) ? (
                    <span className="text-green-500 text-4xl">
                      %
                    </span>
                  ) : ''}
                </span>
                {operator[index] !== undefined && number[index + 1] === undefined ?
                (<span className="text-green-500 flex justify-end">
                  {operator[index] === "*" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : operator[index]}
                </span>)
                : ""
                }
              </div>
            ))}
          </div>
          <div className="text-4xl px-4 text-bold text-green-500">
            {result}
          </div>
        </div>
        <div className="p-3 border-t border-gray-400">
          <div className="grid grid-cols-4 gap-4">
            <Button className='!text-red-500' onClick={() => {
              setNumber([]);
              setOperator([]);
              setResult('');
            }}>
              AC
            </Button>
            <Button className='!text-emerald-500' onClick={() => setNumberToNegative()}>
              +/-
            </Button>
            <Button className='!text-emerald-500' onClick={() => {
              if(number[operator.length] !== undefined){
                setIsPercen(percen => {
                  const newPercen = [...percen];
                  newPercen.push(operator.length);
                  return newPercen;
                });
              }
            }}>
              %
            </Button>
            <Button className='!text-emerald-500' onClick={() => addOperator('/')}>
              /
            </Button>
            <Button onClick={() => addNumber(7)}>7</Button>
            <Button onClick={() => addNumber(8)}>8</Button>
            <Button onClick={() => addNumber(9)}>9</Button>
            <Button className='!text-emerald-500 flex justify-center' onClick={() => addOperator('*')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            </Button>
            <Button onClick={() => addNumber(4)}>4</Button>
            <Button onClick={() => addNumber(5)}>5</Button>
            <Button onClick={() => addNumber(6)}>6</Button>
            <Button className='!text-emerald-500' onClick={() => addOperator('-')}>
              -
            </Button>
            <Button onClick={() => addNumber(1)}>1</Button>
            <Button onClick={() => addNumber(2)}>2</Button>
            <Button onClick={() => addNumber(3)}>3</Button>
            <Button className='!text-emerald-500' onClick={() => addOperator('+')}>
              +
            </Button>
            <Button onClick={() => backSpace()}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
            </svg>
            </Button>
            <Button onClick={() => addNumber(0)}>0</Button>
            <Button onClick={() => {
              setIsComa(true);
              setNumber(number => {
                const newNumber = [...number];
                if(newNumber[operator.length] === undefined){
                  newNumber[operator.length] = '0';
                }
                newNumber[operator.length] = newNumber[operator.length] + ',';
                return newNumber;
              });
            }}>
              ,
            </Button>
            <Button className='!text-blue-500' onClick={() => saveResult()}>
              =
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default App;
