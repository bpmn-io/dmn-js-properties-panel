/* eslint-disable react-hooks/rules-of-hooks */
import {
  useService
} from '../../hooks';

const TooltipProvider = {
  'versionTag': (element) => {

    const translate = useService('translate');

    return (
      <div>
        <p>
          { translate('Specifying a version tag will allow you to reference this process in another process.') }
        </p>
      </div>
    );
  }
};

export default TooltipProvider;
